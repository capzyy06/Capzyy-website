import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// ─── POST /api/v1/orders ──────────────────────────────────────────────────────
export const createOrder = asyncHandler(async (req, res) => {
  const { customer, shippingAddress, items, notes } = req.body;

  // ── Basic presence checks ───────────────────────────────────────────────────
  if (!customer?.name || !customer?.email || !customer?.phone) {
    res.status(400);
    throw new Error('Customer name, email and phone are required');
  }

  if (
    !shippingAddress?.line1 ||
    !shippingAddress?.city  ||
    !shippingAddress?.state ||
    !shippingAddress?.pincode
  ) {
    res.status(400);
    throw new Error('Complete shipping address is required');
  }

  if (!items?.length) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }

  // ── Verify + resolve products server-side ───────────────────────────────────
  const resolvedItems = [];

  for (const item of items) {
    if (!item.product || !item.quantity || item.quantity < 1) {
      res.status(400);
      throw new Error('Each item must have a valid product ID and quantity >= 1');
    }

    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product "${item.name || item.product}" is not available`);
    }

    // ── FIX: stock check against product-level stock ───────────────────────
    // If the order item carries a variant (color/size), also validate
    // against the matching variant's stock when variants are used.
    let availableStock = product.stock;

    if (item.variant?.color || item.variant?.size) {
      const matchedVariant = product.variants.find(
        (v) =>
          (!item.variant.color || v.color === item.variant.color) &&
          (!item.variant.size  || v.size  === item.variant.size)
      );

      if (matchedVariant) {
        // Use variant stock if it is tracked (> 0 means it is managed)
        if (matchedVariant.stock !== undefined) {
          availableStock = matchedVariant.stock;
        }
      }
    }

    if (availableStock < item.quantity) {
      res.status(400);
      throw new Error(
        `"${product.name}" only has ${availableStock} unit(s) in stock`
      );
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

  // ── Compute totals server-side ──────────────────────────────────────────────
  const SHIPPING_COST = 99;

  const subtotal = resolvedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // 2+ caps → FREE shipping, 1 cap → ₹99
  const capCount    = resolvedItems.reduce((sum, i) => sum + i.quantity, 0);
  const shippingCost = capCount >= 2 ? 0 : SHIPPING_COST;
  const total        = subtotal + shippingCost;

  // ── FIX: decrement stock atomically BEFORE creating the order ──────────────
  // Using $inc with a floor guard ($max ensures stock never goes below 0).
  // We use findOneAndUpdate with a stock-availability filter so a concurrent
  // request that already claimed the last unit will fail here rather than
  // creating a phantom order (optimistic concurrency without transactions).
  for (const item of resolvedItems) {
    const updated = await Product.findOneAndUpdate(
      {
        _id:   item.product,
        stock: { $gte: item.quantity }, // only proceed if stock is still sufficient
      },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );

    if (!updated) {
      // Another request claimed the last unit between our check and now
      res.status(409);
      throw new Error(
        `"${item.name}" just sold out. Please remove it from your cart and try again.`
      );
    }
  }

  // ── Create the order ────────────────────────────────────────────────────────
  const order = await Order.create({
    customer,
    shippingAddress,
    items: resolvedItems,
    subtotal,
    shippingCost,
    total,
    notes: notes || '',
  });

  res.status(201).json({ success: true, order });
});

// ─── GET /api/v1/orders  (Admin) ──────────────────────────────────────────────
export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    // FIX: use exact-match prefix anchor (^) and cap length to prevent ReDoS.
    // Regex search without ^ does a full-collection scan; anchoring at start
    // allows MongoDB to use the orderNumber index for prefix queries.
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
    res.status(400);
    throw new Error('Invalid order ID');
  }

  const order = await Order.findById(req.params.id).populate(
    'items.product',
    'name images slug'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({ success: true, order });
});

// ─── PUT /api/v1/orders/:id/status  (Admin) ──────────────────────────────────
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;

  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order ID');
  }

  const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const VALID_PAYMENT  = ['unpaid', 'paid', 'refunded'];

  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (paymentStatus && !VALID_PAYMENT.includes(paymentStatus)) {
    res.status(400);
    throw new Error(`Invalid paymentStatus. Must be one of: ${VALID_PAYMENT.join(', ')}`);
  }

  // FIX: use findByIdAndUpdate to avoid race conditions from two admins
  // updating the same order simultaneously via .save()
  const updates = {};
  if (status)        updates.status        = status;
  if (paymentStatus) updates.paymentStatus = paymentStatus;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({ success: true, order });
});

// ─── GET /api/v1/orders/stats  (Admin) ───────────────────────────────────────
export const getOrderStats = asyncHandler(async (req, res) => {
  const [totalOrders, pendingOrders, revenue, totalProducts] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
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