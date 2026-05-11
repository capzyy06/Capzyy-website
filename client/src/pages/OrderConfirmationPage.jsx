import { Link, useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../store/api/ordersApi';
import { formatPrice } from '../utils/formatPrice';
import Spinner from '../components/common/Spinner';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const order = data?.order;

  if (isLoading) return <Spinner size="lg" className="py-40" />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-8">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>

      <h1 className="font-display text-6xl tracking-widest text-white mb-4">ORDER PLACED!</h1>
      <p className="text-textSecondary text-sm mb-2">Thank you for shopping with Capzyy.</p>
      {order && (
        <>
          <p className="text-white font-semibold tracking-widest text-lg mt-4 mb-1">{order.orderNumber}</p>
          <p className="text-textMuted text-xs mb-8">Save this order number for tracking.</p>

          <div className="bg-surface p-6 text-left space-y-4 mb-8">
            <h2 className="font-display text-xl tracking-widest text-white">ORDER DETAILS</h2>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm border-b border-border pb-3">
                <span className="text-textSecondary">{item.name} × {item.quantity}</span>
                <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between text-white font-bold pt-2">
              <span>TOTAL</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="bg-surface p-6 text-left mb-8">
            <h2 className="font-display text-xl tracking-widest text-white mb-3">SHIPPING TO</h2>
            <p className="text-textSecondary text-sm">{order.customer.name}</p>
            <p className="text-textSecondary text-sm">{order.shippingAddress?.line1}, {order.shippingAddress?.line2}</p>
            <p className="text-textSecondary text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
          </div>
        </>
      )}

      <p className="text-textMuted text-xs mb-8">We'll reach out on {order?.customer?.phone || 'your contact'} once your cap ships.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        <a href="https://instagram.com/capzyy" target="_blank" rel="noreferrer" className="btn-secondary">Follow @capzyy</a>
      </div>
    </div>
  );
}
