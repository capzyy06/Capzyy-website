import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useVerifyPaymentMutation } from '../store/api/paymentsApi';
import { ordersApi } from '../store/api/ordersApi';
import { clearCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import Spinner from '../components/common/Spinner';

const MAX_RETRIES    = 5;
const RETRY_DELAY    = 3000;  // ms between verify retries
const REDIRECT_DELAY = 4;     // seconds before auto-redirect to /my-orders

export default function OrderConfirmationPage() {
  const { id }             = useParams();
  const [searchParams]     = useSearchParams();
  const cfOrderId          = searchParams.get('cfOrderId');
  const navigate           = useNavigate();
  const dispatch           = useDispatch();

  const [verifyPayment]                 = useVerifyPaymentMutation();
  const [order, setOrder]               = useState(null);
  const [paymentState, setPaymentState] = useState('verifying'); // 'verifying' | 'paid' | 'failed'
  const [attempt, setAttempt]           = useState(0);
  const [countdown, setCountdown]       = useState(REDIRECT_DELAY);
  const retryTimeout                    = useRef(null);
  const redirected                      = useRef(false);

  // ── Verify payment with retries ──────────────────────────────────────────
  useEffect(() => {
    if (!id || !cfOrderId) {
      setPaymentState('failed');
      return;
    }

    let cancelled = false;

    const tryVerify = async (attemptNumber) => {
      try {
        const res = await verifyPayment({ orderId: id, cfOrderId }).unwrap();
        if (cancelled) return;

        if (res.paid) {
          setOrder(res.order);
          setPaymentState('paid');
          // Clear cart now that payment is confirmed
          dispatch(clearCart());
          // Force /my-orders to refetch — paymentsApi and ordersApi are separate
          // slices so invalidateTags across slices doesn't work automatically.
          dispatch(ordersApi.util.invalidateTags(['Order']));
          return;
        }

        if (attemptNumber < MAX_RETRIES) {
          setAttempt(attemptNumber + 1);
          retryTimeout.current = setTimeout(() => tryVerify(attemptNumber + 1), RETRY_DELAY);
        } else {
          setPaymentState('failed');
        }
      } catch {
        if (cancelled) return;
        if (attemptNumber < MAX_RETRIES) {
          setAttempt(attemptNumber + 1);
          retryTimeout.current = setTimeout(() => tryVerify(attemptNumber + 1), RETRY_DELAY);
        } else {
          setPaymentState('failed');
        }
      }
    };

    tryVerify(0);

    return () => {
      cancelled = true;
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, [id, cfOrderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Countdown + redirect after payment confirmed ─────────────────────────
  // navigate() is called from a setTimeout callback — never during render —
  // which avoids the "Cannot update BrowserRouter while rendering" warning.
  useEffect(() => {
    if (paymentState !== 'paid') return;

    const interval = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1));
    }, 1000);

    const timer = setTimeout(() => {
      if (!redirected.current) {
        redirected.current = true;
        navigate('/my-orders', { replace: true });
      }
    }, REDIRECT_DELAY * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [paymentState, navigate]);

  // ── Verifying ─────────────────────────────────────────────────────────────
  if (paymentState === 'verifying') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-40 text-center">
        <Spinner size="lg" className="mx-auto mb-6" />
        <p className="text-textSecondary text-sm tracking-widest">VERIFYING PAYMENT...</p>
        <p className="text-textMuted text-xs mt-2">
          {attempt > 0
            ? `Still checking... (attempt ${attempt + 1} of ${MAX_RETRIES + 1})`
            : 'Please do not close this page.'}
        </p>
      </div>
    );
  }

  // ── Failed ────────────────────────────────────────────────────────────────
  if (paymentState === 'failed') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-sale rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="font-display text-5xl tracking-widest text-white mb-4">PAYMENT FAILED</h1>
        <p className="text-textSecondary text-sm mb-8">
          Your payment could not be confirmed. No money was charged.<br />
          If money was deducted, it will be refunded within 5–7 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/cart" className="btn-primary">Try Again</Link>
          <Link to="/shop" className="btn-secondary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">

      <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-8">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-display text-6xl tracking-widest text-white mb-4">ORDER PLACED!</h1>
      <p className="text-textSecondary text-sm mb-2">Thank you for shopping with Capzyy.</p>

      {order && (
        <>
          <p className="text-white font-semibold tracking-widest text-lg mt-4 mb-1">
            {order.orderNumber}
          </p>
          <p className="text-textMuted text-xs mb-8">Save this order number for tracking.</p>

          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-xs px-4 py-2 rounded-full mb-8 tracking-widest">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            PAYMENT CONFIRMED
          </div>

          <div className="bg-surface p-6 text-left space-y-4 mb-6">
            <h2 className="font-display text-xl tracking-widest text-white">ORDER DETAILS</h2>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm border-b border-border pb-3">
                <span className="text-textSecondary">{item.name} × {item.quantity}</span>
                <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm text-textSecondary">
              <span>Shipping</span>
              <span className={order.shippingCost === 0 ? 'text-success' : 'text-white'}>
                {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-white font-bold pt-2 border-t border-border">
              <span>TOTAL</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="bg-surface p-6 text-left mb-8">
            <h2 className="font-display text-xl tracking-widest text-white mb-3">SHIPPING TO</h2>
            <p className="text-textSecondary text-sm">{order.customer?.name}</p>
            <p className="text-textSecondary text-sm">
              {order.shippingAddress?.line1}
              {order.shippingAddress?.line2 ? `, ${order.shippingAddress.line2}` : ''}
            </p>
            <p className="text-textSecondary text-sm">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
            </p>
          </div>
        </>
      )}

      <p className="text-textMuted text-xs mb-8">
        We'll reach out on {order?.customer?.phone || 'your contact'} once your cap ships.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/my-orders"
          onClick={() => { redirected.current = true; }}
          className="btn-primary"
        >
          View My Orders
        </Link>
        <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
      </div>

      <p className="text-textMuted text-xs mt-6">
        Redirecting to your orders in {countdown}s…
      </p>

    </div>
  );
}