import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// POST /api/v1/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { customer, shippingAddress, items, notes } = req.body;

  // ── Basic presence checks ─────────────────────────────────────────────
  if (!customer?.name || !customer?.email || !customer?.phone) {
    res.status(400);
    throw new Error('Customer name, email and phone are required');
  }

  if (
    !shippingAddress?.line1 ||
    !shippingAddress?.city ||
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

  // ── Verify products server-side ───────────────────────────────────────
  const resolvedItems = [];

  for (const item of items) {
    if (!item.product || !item.quantity || item.quantity < 1) {
      res.status(400);
      throw new Error(
        'Each item must have a valid product ID and quantity >= 1'
      );
    }

    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(
        `Product "${item.name || item.product}" is not available`
      );
    }

    // Check stock
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(
        `"${product.name}" only has ${product.stock} unit(s) in stock`
      );
    }

    resolvedItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
      variant: item.variant || {},
    });
  }

  // ── Compute totals server-side ────────────────────────────────────────
  const SHIPPING_THRESHOLD = 999;
  const SHIPPING_COST = 99;

  const subtotal = resolvedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingCost =
    subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const total = subtotal + shippingCost;

  // ── Create order ──────────────────────────────────────────────────────
  const order = await Order.create({
    customer,
    shippingAddress,
    items: resolvedItems,
    subtotal,
    shippingCost,
    total,
    notes: notes || '',
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// GET /api/v1/orders (Admin)
export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.orderNumber = {
      $regex: search,
      $options: 'i',
    };
  }

  const total = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    success: true,
    total,
    orders,
  });
});

// GET /api/v1/orders/:id (Admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'items.product',
    'name images slug'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({
    success: true,
    order,
  });
});

// PUT /api/v1/orders/:id/status (Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (status) {
    order.status = status;
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  await order.save();

  res.json({
    success: true,
    order,
  });
});

// GET /api/v1/orders/stats (Admin)
export const getOrderStats = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    pendingOrders,
    revenue,
    totalProducts,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
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