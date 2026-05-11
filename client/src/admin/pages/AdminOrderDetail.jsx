import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '../../store/api/ordersApi';
import { formatPrice } from '../../utils/formatPrice';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['unpaid', 'paid', 'refunded'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const order = data?.order;

  const handleStatusUpdate = async (field, value) => {
    try {
      await updateOrderStatus({ id, [field]: value }).unwrap();
      toast.success('Order updated!');
    } catch { toast.error('Update failed'); }
  };

  if (isLoading) return <Spinner size="lg" className="py-40" />;
  if (!order) return <div className="p-8 text-textSecondary">Order not found</div>;

  return (
    <div className="p-8 max-w-4xl">
      <button onClick={() => navigate('/admin/orders')} className="text-xs text-textSecondary hover:text-white uppercase tracking-wider mb-6 block">← Back to Orders</button>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-white">{order.orderNumber}</h1>
          <p className="text-textMuted text-xs mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <div className="flex gap-3">
          <select value={order.status} onChange={e => handleStatusUpdate('status', e.target.value)} className="input-field w-auto text-xs">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={order.paymentStatus} onChange={e => handleStatusUpdate('paymentStatus', e.target.value)} className="input-field w-auto text-xs">
            {PAYMENT_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Customer */}
        <div className="bg-surface border border-border p-6">
          <h2 className="font-display text-lg tracking-widest text-white mb-4">CUSTOMER</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-textSecondary">Name:</span> <span className="text-white ml-2">{order.customer.name}</span></p>
            <p><span className="text-textSecondary">Email:</span> <span className="text-white ml-2">{order.customer.email}</span></p>
            <p><span className="text-textSecondary">Phone:</span> <span className="text-white ml-2">{order.customer.phone}</span></p>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-surface border border-border p-6">
          <h2 className="font-display text-lg tracking-widest text-white mb-4">SHIPPING ADDRESS</h2>
          <div className="text-sm text-textSecondary space-y-1">
            <p>{order.shippingAddress?.line1}</p>
            {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
            <p>{order.shippingAddress?.pincode}, {order.shippingAddress?.country}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-surface border border-border mb-6">
        <div className="p-4 border-b border-border"><h2 className="font-display text-lg tracking-widest text-white">ORDER ITEMS</h2></div>
        <div className="divide-y divide-border">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover bg-bg" />}
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">{item.name}</p>
                {item.variant?.color && <p className="text-textMuted text-xs">{item.variant.color}{item.variant.size ? ` / ${item.variant.size}` : ''}</p>}
              </div>
              <p className="text-textSecondary text-sm">× {item.quantity}</p>
              <p className="text-white text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm text-textSecondary"><span>Subtotal</span><span className="text-white">{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-sm text-textSecondary"><span>Shipping</span><span className="text-white">{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span></div>
          <div className="flex justify-between font-bold text-white border-t border-border pt-2"><span>TOTAL</span><span>{formatPrice(order.total)}</span></div>
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
