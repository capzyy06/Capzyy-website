import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../store/api/ordersApi';
import { clearCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { SHIPPING_THRESHOLD, SHIPPING_COST } from '../constants/config';
import toast from 'react-hot-toast';

const INITIAL = { name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', notes: '' };

export default function CheckoutPage() {
  const { items, total } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  // BUG C-7 FIX: navigate() moved into useEffect — calling it in the render
  // phase is a side effect; React Strict Mode double-invokes renders which
  // caused this to fire before the component had fully mounted
  useEffect(() => {
    if (!items.length) navigate('/cart');
  }, [items.length, navigate]);

  // Still return null while the effect fires to avoid rendering with empty items
  if (!items.length) return null;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit mobile number required';
    if (!form.line1.trim()) e.line1 = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = '6-digit pincode required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      const orderPayload = {
        customer: { name: form.name, email: form.email, phone: form.phone },
        shippingAddress: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode, country: 'India' },
        items: items.map(i => ({ product: i.productId, name: i.name, image: i.image, price: i.price, quantity: i.quantity, variant: i.variant })),
        subtotal: total,
        shippingCost: shipping,
        total: grandTotal,
        notes: form.notes,
      };
      const res = await createOrder(orderPayload).unwrap();
      dispatch(clearCart());
      navigate(`/order-confirmation/${res.order._id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  const field = (key, label, type = 'text', placeholder = '', full = false) => (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="text-xs font-semibold tracking-widest uppercase text-textSecondary block mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={3} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder} className="input-field resize-none" />
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder} className={`input-field ${errors[key] ? 'border-sale' : ''}`} />
      )}
      {errors[key] && <p className="text-sale text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-6xl md:text-8xl tracking-widest text-white mb-10">CHECKOUT</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="font-display text-2xl tracking-widest text-white mb-4">CONTACT INFO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('name', 'Full Name', 'text', 'John Doe', true)}
              {field('email', 'Email', 'email', 'john@example.com')}
              {field('phone', 'Phone', 'tel', '9876543210')}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-widest text-white mb-4">SHIPPING ADDRESS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('line1', 'Address Line 1', 'text', 'House/Flat No., Street', true)}
              {field('line2', 'Address Line 2 (Optional)', 'text', 'Area, Landmark', true)}
              {field('city', 'City', 'text', 'Mumbai')}
              {field('state', 'State', 'text', 'Maharashtra')}
              {field('pincode', 'Pincode', 'text', '400001')}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-widest text-white mb-4">ORDER NOTES</h2>
            {field('notes', 'Special Instructions (Optional)', 'textarea', 'Leave at door, gift wrap, etc.', true)}
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
            {isLoading ? 'Placing Order...' : `Place Order — ${formatPrice(grandTotal)}`}
          </button>
          <p className="text-textMuted text-xs text-center">By placing your order, you agree to our terms and conditions.</p>
        </form>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="bg-surface p-6">
            <h2 className="font-display text-2xl tracking-widest text-white mb-6">ORDER SUMMARY</h2>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.key} className="flex gap-4">
                  <div className="relative">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 object-cover bg-surfaceHover flex-shrink-0" />
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                    {item.variant?.color && <p className="text-textMuted text-xs">{item.variant.color} {item.variant.size && `/ ${item.variant.size}`}</p>}
                    <p className="text-white text-sm mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-6 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-textSecondary"><span>Subtotal</span><span className="text-white">{formatPrice(total)}</span></div>
              <div className="flex justify-between text-textSecondary">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-success' : 'text-white'}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-border pt-3">
                <span>TOTAL</span><span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
          <div className="bg-surface p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-textSecondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <p className="text-textSecondary text-xs">Your information is secure and encrypted.</p>
          </div>
        </div>
      </div>
    </div>
  );
}