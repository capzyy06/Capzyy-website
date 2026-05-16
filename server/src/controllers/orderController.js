import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderStatusEmail } from '../utils/sendEmail.js';

// ─── POST /api/v1/orders ──────────────────────────────────────────────────────
export const createOrder = asyncHandler(async (req, res) => {
  const { customer, shippingAddress, items, notes } = req.body;

  if (!customer?.name || !customer?.email || !customer?.phone) {
    res.status(400); throw new Error('Customer name, email and phone are required');
  }
  if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.pincode) {
    res.status(400); throw new Error('Complete shipping address is required');
  }
  if (!items?.length) {
    res.status(400); throw new Error('Order must contain at least one item');
  }

  const resolvedItems = [];

  for (const item of items) {
    if (!item.product || !item.quantity || item.quantity < 1) {
      res.status(400); throw new Error('Each item must have a valid product ID and quantity >= 1');
    }

    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(400); throw new Error(`Product "${item.name || item.product}" is not available`);
    }

    let availableStock = product.stock;

    if (item.variant?.color || item.variant?.size) {
      const matchedVariant = product.variants.find(
        (v) =>
          (!item.variant.color || v.color === item.variant.color) &&
          (!item.variant.size  || v.size  === item.variant.size)
      );
      if (matchedVariant && matchedVariant.stock !== undefined) {
        availableStock = matchedVariant.stock;
      }
    }

    if (availableStock < item.quantity) {
      res.status(400);
      throw new Error(`"${product.name}" only has ${availableStock} unit(s) in stock`);
    }

    resolvedItems.push({
      product:  product._id,
      name:     product.name,
      image:    product.images?.[0]?.url || '',
      price:    product.price,
      quantity: item.quantity,
      variant:  item.variant || {},
    });
  }

  const SHIPPING_COST = 99;
  const subtotal      = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const capCount      = resolvedItems.reduce((sum, i) => sum + i.quantity, 0);
  const shippingCost  = capCount >= 2 ? 0 : SHIPPING_COST;
  const total         = subtotal + shippingCost;

  for (const item of resolvedItems) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!updated) {
      res.status(409);
      throw new Error(`"${item.name}" just sold out. Please remove it from your cart and try again.`);
    }
  }

  // FIX: always override customer.email with req.user.email.
  // getMyOrders queries by req.user.email — if the checkout form email differs
  // the order is invisible in order history.
  const safeCustomer = { ...customer, email: req.user.email };

  const order = await Order.create({
    customer: safeCustomer,
    shippingAddress,
    items: resolvedItems,
    subtotal,
    shippingCost,
    total,
    notes: notes || '',
  });

  res.status(201).json({ success: true, order });
});

// ─── GET /api/v1/orders/my-orders  (Customer) ────────────────────────────────
export const getMyOrders = asyncHandler(async (req, res) => {
  const email = req.user.email;

  const orders = await Order.find({ 'customer.email': email })
    .sort({ createdAt: -1 })
    .select('orderNumber status paymentStatus total items createdAt shippingAddress customer');

  res.json({ success: true, orders });
});

// ─── GET /api/v1/orders  (Admin) ──────────────────────────────────────────────
export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const query = {};

  if (status) query.status = status;

  if (search) {
    const safeSearch = search.trim().slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.orderNumber = { $regex: `^${safeSearch}`, $options: 'i' };
  }

  const [total, orders] = await Promise.all([
    Order.countDocuments(query),
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
  ]);

  res.json({
    success: true,
    total,
    page:       Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    orders,
  });
});

// ─── GET /api/v1/orders/:id  (Admin) ─────────────────────────────────────────
export const getOrderById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400); throw new Error('Invalid order ID');
  }

  const order = await Order.findById(req.params.id).populate('items.product', 'name images slug');
  if (!order) {
    res.status(404); throw new Error('Order not found');
  }

  res.json({ success: true, order });
});

// ─── PUT /api/v1/orders/:id/status  (Admin) ──────────────────────────────────
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400); throw new Error('Invalid order ID');
  }

  const ADMIN_ALLOWED_STATUSES = ['shipped', 'delivered', 'rejected'];

  if (!status || !ADMIN_ALLOWED_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Admin can only set: ${ADMIN_ALLOWED_STATUSES.join(', ')}`);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true, runValidators: true }
  );

  if (!order) {
    res.status(404); throw new Error('Order not found');
  }

  // Send email for delivered or rejected
  if (status === 'delivered' || status === 'rejected') {
    try {
      await sendOrderStatusEmail({
        to:           order.customer.email,
        customerName: order.customer.name,
        orderNumber:  order.orderNumber,
        newStatus:    status,
      });
    } catch (emailErr) {
      // Never break the response over email failure
      console.error(`[email] Failed to send "${status}" email for ${order.orderNumber}:`, emailErr.message);
    }
  }

  res.json({ success: true, order });
});

// ─── GET /api/v1/orders/stats  (Admin) ───────────────────────────────────────
export const getOrderStats = asyncHandler(async (req, res) => {
  const [totalOrders, pendingOrders, revenue, totalProducts] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    Product.countDocuments({ isActive: true }),
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders,
      pendingOrders,
      totalRevenue: revenue[0]?.total || 0,
      totalProducts,
    },
  });
});