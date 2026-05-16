import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '../../store/api/ordersApi';
import { formatPrice } from '../../utils/formatPrice';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  confirmed: 'text-blue-400  bg-blue-400/10  border-blue-400/20',
  shipped:   'text-purple-400 bg-purple-400/10 border-purple-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400   bg-red-400/10   border-red-400/20',
  rejected:  'text-red-400   bg-red-400/10   border-red-400/20',
};

const ADMIN_ACTIONS = [
  {
    value:     'shipped',
    label:     'Mark as Shipped',
    color:     'bg-purple-600 hover:bg-purple-700 text-white',
    confirm:   null,
    emailNote: null,
  },
  {
    value:     'delivered',
    label:     'Mark as Delivered',
    color:     'bg-green-600 hover:bg-green-700 text-white',
    confirm:   null,
    emailNote: 'Customer will receive a delivery confirmation email.',
  },
  {
    value:     'rejected',
    label:     'Reject Order',
    color:     'bg-red-700 hover:bg-red-800 text-white',
    confirm:   'Are you sure you want to reject this order? The customer will be notified by email.',
    emailNote: 'Customer will receive a rejection & refund notice email.',
  },
];

const TERMINAL_STATUSES = ['delivered', 'rejected', 'cancelled'];

export default function AdminOrderDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const order = data?.order;

  const handleAction = async (newStatus, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    try {
      await updateOrderStatus({ id, status: newStatus }).unwrap();
      toast.success(`Order marked as ${newStatus}.`);
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed. Please try again.');
    }
  };

  if (isLoading) return <Spinner size="lg" className="py-40" />;
  if (!order)    return <div className="p-4 text-textSecondary">Order not found</div>;

  const isTerminal = TERMINAL_STATUSES.includes(order.status);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <button
        onClick={() => navigate('/admin/orders')}
        className="text-xs text-textSecondary hover:text-white uppercase tracking-wider mb-5 min-h-[36px] flex items-center"
      >
        ← Back to Orders
      </button>

      <div className="mb-6">
        <div className="flex flex-col gap-1 mb-4">
          <h1 className="font-display text-2xl sm:text-4xl tracking-widest text-white leading-tight break-all">
            {order.orderNumber}
          </h1>
          <p className="text-textMuted text-xs">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>

        {/* Current status — read only */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
            {order.status}
          </span>
          <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border ${
            order.paymentStatus === 'paid'
              ? 'text-green-400 bg-green-400/10 border-green-400/20'
              : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
          }`}>
            {order.paymentStatus}
          </span>
        </div>

        {/* Admin action buttons */}
        {isTerminal ? (
          <p className="text-xs text-textMuted uppercase tracking-wider">
            This order is {order.status} — no further actions available.
          </p>
        ) : (
          <div className="bg-surface border border-border p-4 rounded">
            <p className="text-xs text-textSecondary uppercase tracking-widest mb-3">Update Order Status</p>
            <div className="flex flex-wrap gap-3">
              {ADMIN_ACTIONS.map(action => (
                <div key={action.value} className="flex flex-col gap-1">
                  <button
                    disabled={isUpdating || order.status === action.value}
                    onClick={() => handleAction(action.value, action.confirm)}
                    className={`text-xs font-semibold uppercase tracking-wider px-4 py-2.5 min-h-[40px] rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${action.color}`}
                  >
                    {isUpdating ? 'Saving…' : action.label}
                  </button>
                  {action.emailNote && (
                    <p className="text-[10px] text-textMuted">📧 {action.emailNote}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer + Shipping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface border border-border p-4 sm:p-6">
          <h2 className="font-display text-base sm:text-lg tracking-widest text-white mb-3">CUSTOMER</h2>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col xs:flex-row xs:gap-2">
              <span className="text-textSecondary flex-shrink-0">Name:</span>
              <span className="text-white break-words">{order.customer.name}</span>
            </div>
            <div className="flex flex-col xs:flex-row xs:gap-2">
              <span className="text-textSecondary flex-shrink-0">Email:</span>
              <span className="text-white break-all">{order.customer.email}</span>
            </div>
            <div className="flex flex-col xs:flex-row xs:gap-2">
              <span className="text-textSecondary flex-shrink-0">Phone:</span>
              <span className="text-white">{order.customer.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 sm:p-6">
          <h2 className="font-display text-base sm:text-lg tracking-widest text-white mb-3">SHIPPING ADDRESS</h2>
          <div className="text-sm text-textSecondary space-y-1">
            <p>{order.shippingAddress?.line1}</p>
            {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
            <p>{order.shippingAddress?.pincode}, {order.shippingAddress?.country}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-surface border border-border mb-5">
        <div className="p-4 border-b border-border">
          <h2 className="font-display text-base sm:text-lg tracking-widest text-white">ORDER ITEMS</h2>
        </div>
        <div className="divide-y divide-border">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-12 h-12 flex-shrink-0 object-cover bg-bg rounded" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                {item.variant?.color && (
                  <p className="text-textMuted text-xs">
                    {item.variant.color}{item.variant.size ? ` / ${item.variant.size}` : ''}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <p className="text-textSecondary text-xs">× {item.quantity}</p>
                <p className="text-white text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm text-textSecondary">
            <span>Subtotal</span>
            <span className="text-white">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-textSecondary">
            <span>Shipping</span>
            <span className="text-white">{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-white border-t border-border pt-2">
            <span>TOTAL</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="bg-surface border border-border p-4">
          <h2 className="text-xs tracking-widest uppercase text-textSecondary mb-2">Customer Notes</h2>
          <p className="text-textSecondary text-sm">{order.notes}</p>
        </div>
      )}
    </div>
  );
}