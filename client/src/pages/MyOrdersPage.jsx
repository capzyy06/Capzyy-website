import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMyOrdersQuery } from '../store/api/ordersApi';
import { formatPrice } from '../utils/formatPrice';
import Spinner from '../components/common/Spinner';

const STATUS_COLORS = {
  pending:   'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400  bg-blue-400/10',
  shipped:   'text-purple-400 bg-purple-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400   bg-red-400/10',
  rejected:  'text-red-400   bg-red-400/10',
};

export default function MyOrdersPage() {
  const { user } = useSelector(s => s.auth);
  const { data, isLoading, isError } = useGetMyOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !user,
  });

  const orders = data?.orders || [];

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl tracking-widest text-white mb-4">MY ORDERS</h1>
        <p className="text-textSecondary text-sm mb-6">Please log in to view your order history.</p>
        <Link to="/login" className="btn-primary">Log In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl sm:text-6xl tracking-widest text-white mb-8">MY ORDERS</h1>

      {isLoading && <Spinner size="lg" className="py-20" />}

      {isError && (
        <p className="text-textSecondary text-sm py-12 text-center">
          Failed to load your orders. Please try again later.
        </p>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="text-center py-20">
          <p className="text-textSecondary text-sm mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-primary">Shop Now</Link>
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-surface border border-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-white">{order.orderNumber}</span>
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                    {order.status}
                  </span>
                  <span className={`text-xs ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <span className="text-textMuted text-xs">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div className="text-sm text-textSecondary mb-3">
                {order.items?.slice(0, 3).map((item, i) => (
                  <span key={i}>
                    {item.name} × {item.quantity}
                    {i < Math.min(order.items.length, 3) - 1 ? ', ' : ''}
                  </span>
                ))}
                {order.items?.length > 3 && (
                  <span className="text-textMuted"> +{order.items.length - 3} more</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-white font-semibold text-sm">{formatPrice(order.total)}</span>
                <span className="text-xs text-textSecondary">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}