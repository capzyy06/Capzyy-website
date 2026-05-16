import asyncHandler from 'express-async-handler';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import Order from '../models/Order.js';

// ─── Cashfree v5 SDK setup ─────────────────────────────────────────────────────
const cf = new Cashfree(
  process.env.CASHFREE_ENV === 'production'
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

cf.XApiVersion = '2023-08-01';

// ─── POST /api/v1/payments/create-order ───────────────────────────────────────
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error('orderId is required');
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.paymentStatus === 'paid') {
    res.status(400);
    throw new Error('This order is already paid');
  }

  const cfOrderId = `${order.orderNumber.replace(/-/g, '')}-${Date.now()}`;

  const cfOrderRequest = {
    order_id:       cfOrderId,
    order_amount:   Number(order.total),
    order_currency: 'INR',
    customer_details: {
      customer_id:    order._id.toString(),
      customer_name:  order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone.replace(/\D/g, '').slice(-10),
    },
    order_meta: {
      // {order_id} is a Cashfree template token — only resolved in redirect-based flows.
      // We use _modal so the JS promise resolves instead, but set a correct fallback URL anyway.
      return_url: `${process.env.CLIENT_URL}/order-confirmation/${order._id}?cfOrderId=${cfOrderId}`,
      notify_url: `${process.env.SERVER_URL}/api/v1/payments/webhook`,
    },
    order_note: order.notes || 'Capzyy order',
  };

  let cfResponse;
  try {
    cfResponse = await cf.PGCreateOrder(cfOrderRequest);
  } catch (err) {
    console.error('Cashfree PGCreateOrder error:', err?.response?.data ?? err?.message);
    res.status(502);
    throw new Error(
      err?.response?.data?.message || 'Failed to create Cashfree payment session'
    );
  }

  if (!cfResponse?.data?.payment_session_id) {
    res.status(502);
    throw new Error('Failed to create Cashfree payment session');
  }

  await Order.findByIdAndUpdate(orderId, {
    cfOrderId: cfResponse.data.order_id,
  });

  res.json({
    success:          true,
    orderId:          order._id,
    orderNumber:      order.orderNumber,
    paymentSessionId: cfResponse.data.payment_session_id,
    cfOrderId:        cfResponse.data.order_id,
  });
});

// ─── POST /api/v1/payments/verify ─────────────────────────────────────────────
// Retries up to MAX_VERIFY_RETRIES times with a delay between each attempt.
// Cashfree sometimes returns ACTIVE immediately after payment because their
// system hasn't settled the transaction yet — without retries the order stays
// pending/unpaid in the admin panel.
const MAX_VERIFY_RETRIES = 4;
const VERIFY_RETRY_MS    = 2000;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, cfOrderId } = req.body;

  if (!orderId || !cfOrderId) {
    res.status(400);
    throw new Error('orderId and cfOrderId are required');
  }

  let cfOrder = null;
  let lastErr  = null;

  for (let attempt = 0; attempt <= MAX_VERIFY_RETRIES; attempt++) {
    if (attempt > 0) await sleep(VERIFY_RETRY_MS);

    try {
      const cfResponse = await cf.PGFetchOrder(cfOrderId);
      cfOrder = cfResponse?.data;
    } catch (err) {
      lastErr = err;
      console.error(`[verify] PGFetchOrder attempt ${attempt + 1} error:`, err?.response?.data ?? err?.message);
      continue;
    }

    if (!cfOrder) continue;

    // Got PAID — no need to keep retrying
    if (cfOrder.order_status === 'PAID') break;

    console.log(`[verify] attempt ${attempt + 1}: status=${cfOrder.order_status}, retrying...`);
  }

  if (!cfOrder) {
    res.status(502);
    throw new Error(
      lastErr?.response?.data?.message || 'Could not fetch payment status from Cashfree'
    );
  }

  const isPaid = cfOrder.order_status === 'PAID';

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: isPaid ? 'paid'      : 'unpaid',
      status:        isPaid ? 'confirmed' : 'pending',
    },
    { new: true }
  );

  if (!updatedOrder) {
    res.status(404);
    throw new Error('Order not found in database');
  }

  res.json({
    success:       true,
    paid:          isPaid,
    cfOrderStatus: cfOrder.order_status,
    order:         updatedOrder,
  });
});

// ─── POST /api/v1/payments/webhook ────────────────────────────────────────────
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  const rawBody   = JSON.stringify(req.body);

  let isValid = false;
  try {
    cf.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    isValid = true;
  } catch {
    isValid = false;
  }

  if (!isValid) {
    res.status(401);
    throw new Error('Invalid webhook signature');
  }

  const event     = req.body;
  const eventType = event?.type;

  if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
    const cfOrderId = event?.data?.order?.order_id;
    if (cfOrderId) {
      await Order.findOneAndUpdate(
        { cfOrderId },
        { paymentStatus: 'paid', status: 'confirmed' }
      );
    }
  }

  res.json({ success: true });
});