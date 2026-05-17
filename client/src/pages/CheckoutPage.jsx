import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../store/api/ordersApi';
import { useCreatePaymentOrderMutation } from '../store/api/paymentsApi';
import { formatPrice } from '../utils/formatPrice';
import { SHIPPING_THRESHOLD, SHIPPING_COST } from '../constants/config';
import toast from 'react-hot-toast';

const INITIAL = {
  name: '', email: '', phone: '',
  line1: '', line2: '', city: '', state: '', pincode: '',
  notes: '',
};

// ─── Load Cashfree JS SDK once ────────────────────────────────────────────────
let cfSdkPromise = null;
function loadCashfreeSdk() {
  if (cfSdkPromise) return cfSdkPromise;
  cfSdkPromise = new Promise((resolve, reject) => {
    if (window.Cashfree) { resolve(window.Cashfree); return; }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload  = () => resolve(window.Cashfree);
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.head.appendChild(script);
  });
  return cfSdkPromise;
}

export default function CheckoutPage() {
  const { items, total } = useSelector(s => s.cart);
  // FIX: read logged-in user so we can pre-fill the form and ensure the
  // order email always matches the account email (needed for /my-orders lookup)
  const { user }   = useSelector(s => s.auth);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  // FIX: pre-fill form from logged-in user account.
  // This guarantees the customer.email stored on the order matches req.user.email
  // which is what getMyOrders queries by. If a user types a different email the
  // order would never appear in their order history.
  const [form, setForm]     = useState(() => ({
    ...INITIAL,
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
  }));
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);

  const [createOrder,        { isLoading: isCreatingOrder   }] = useCreateOrderMutation();
  const [createPaymentOrder, { isLoading: isCreatingPayment }] = useCreatePaymentOrderMutation();

  const isLoading = isCreatingOrder || isCreatingPayment || paying;

  // ── Shipping logic ──────────────────────────────────────────────────────────
  // 1 cap  → ₹99 shipping
  // 2 caps → FREE shipping
  // 3+ caps → FREE shipping + surprise cap
  const capCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = capCount >= 2 ? 0 : capCount === 1 ? SHIPPING_COST : 0;

  const grandTotal      = total + shipping;
  const showCapUpsell   = capCount === 1;
  const showSurpriseMsg = capCount >= 3;
  useEffect(() => {
    if (!items.length) navigate('/cart');
  }, [items.length, navigate]);

  if (!items.length) return null;

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())                               e.name    = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email  = 'Valid email required';
    if (!form.phone.match(/^[6-9]\d{9}$/))               e.phone   = 'Valid 10-digit mobile number required';
    if (!form.line1.trim())                              e.line1   = 'Address is required';
    if (!form.city.trim())                               e.city    = 'City is required';
    if (!form.state.trim())                              e.state   = 'State is required';
    if (!form.pincode.match(/^\d{6}$/))                  e.pincode = '6-digit pincode required';
    return e;
  };

  // ── Main submit handler ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    let capzyyOrderId = null;
    let cfOrderId     = null;

    try {
      // ── Step 1: Create order in our DB ──────────────────────────────────────
      // FIX: always use the logged-in user's email as customer email.
      // The server's getMyOrders queries by req.user.email — if the form email
      // differs the order would be invisible in order history.
      const orderPayload = {
        customer:        { name: form.name, email: user?.email || form.email, phone: form.phone },
        shippingAddress: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode, country: 'India' },
        items:           items.map(i => ({ product: i.productId, name: i.name, image: i.image, price: i.price, quantity: i.quantity, variant: i.variant })),
        subtotal:        total,
        shippingCost:    shipping,
        total:           grandTotal,
        notes:           form.notes,
      };

      const orderRes = await createOrder(orderPayload).unwrap();
      capzyyOrderId  = orderRes.order._id;

      // ── Step 2: Get Cashfree payment session ────────────────────────────────
      const paymentRes = await createPaymentOrder({ orderId: capzyyOrderId }).unwrap();
      const sessionId  = paymentRes.paymentSessionId;
      cfOrderId        = paymentRes.cfOrderId;

      // ── Step 3: Load Cashfree SDK and open checkout ─────────────────────────
      const CashfreeSDK = await loadCashfreeSdk();

      const mode = import.meta.env.VITE_CASHFREE_MODE || 'production';
      const cashfree = CashfreeSDK({ mode });

      setPaying(true);

      const result = await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget:   '_modal',
      });

      if (result.error) {
        setPaying(false);
        toast.error(result.error.message || 'Payment failed. Please try again.');
        return;
      }

      // ── Step 4: Modal closed without error — go to confirmation ─────────────
      // Do NOT clearCart here. OrderConfirmationPage verifies with Cashfree
      // and clears the cart only after confirming the payment is truly PAID.
      navigate(`/order-confirmation/${capzyyOrderId}?cfOrderId=${cfOrderId}`);

    } catch (err) {
      setPaying(false);
      toast.error(err?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  // ── Field renderer ──────────────────────────────────────────────────────────
  const field = (key, label, type = 'text', placeholder = '', full = false) => (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="text-xs font-semibold tracking-widest uppercase text-textSecondary block mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea
          rows={3}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="input-field resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className={`input-field ${errors[key] ? 'border-sale' : ''}`}
        />
      )}
      {errors[key] && <p className="text-sale text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  const btnLabel = isCreatingOrder   ? 'Creating Order...'
                 : isCreatingPayment ? 'Initialising Payment...'
                 : paying            ? 'Complete Payment in Popup...'
                 : `Pay ${formatPrice(grandTotal)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-6xl md:text-8xl tracking-widest text-white mb-10">CHECKOUT</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="font-display text-2xl tracking-widest text-white mb-4">CONTACT INFO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('name',  'Full Name', 'text',  'John Doe',        true)}
              {field('email', 'Email',     'email', 'john@example.com')}
              {field('phone', 'Phone',     'tel',   '9876543210')}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-widest text-white mb-4">SHIPPING ADDRESS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('line1',   'Address Line 1',            'text', 'House/Flat No., Street', true)}
              {field('line2',   'Address Line 2 (Optional)', 'text', 'Area, Landmark',         true)}
              {field('city',    'City',                      'text', 'Mumbai')}
              {field('state',   'State',                     'text', 'Maharashtra')}
              {field('pincode', 'Pincode',                   'text', '400001')}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-widest text-white mb-4">ORDER NOTES</h2>
            {field('notes', 'Special Instructions (Optional)', 'textarea', 'Leave at door, gift wrap, etc.', true)}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            )}
            {btnLabel}
          </button>

          <p className="text-textMuted text-xs text-center">
            Payments are processed securely by Cashfree.
          </p>
        </form>

        {/* ── Order Summary ─────────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="bg-surface p-6">
            <h2 className="font-display text-2xl tracking-widest text-white mb-6">ORDER SUMMARY</h2>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.key} className="flex gap-4">
                  <div className="relative">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover bg-surfaceHover flex-shrink-0"
                    />
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                    {item.variant?.color && (
                      <p className="text-textMuted text-xs">
                        {item.variant.color}{item.variant.size && ` / ${item.variant.size}`}
                      </p>
                    )}
                    <p className="text-white text-sm mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-6 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-textSecondary">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-textSecondary">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-success' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {showSurpriseMsg ? (
                  <p className="text-xs text-lime-400 leading-relaxed">
                    🎁 You're getting a surprise cap with your order!<br />
                    (Thank You For Shopping With CAPZYY!)
                  </p>
                ) : showCapUpsell ? (
                  <p className="text-xs text-amber-400 leading-relaxed">
                    🧢 Add 1 more cap to get free shipping!
                  </p>
                ) : capCount === 0 ? (
                  <p className="text-xs text-amber-400 leading-relaxed">
                    🧢 Order 2+ caps to get free shipping on your order.
                  </p>
                ) : null}
              </div>

              <div className="flex justify-between text-white font-bold text-base border-t border-border pt-3">
                <span>TOTAL</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-textSecondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-textSecondary text-xs">Your information is secure and encrypted.</p>
          </div>
        </div>

      </div>
    </div>
  );
}