import { useGetOrderStatsQuery } from '../../store/api/ordersApi';
import { useGetOrdersQuery } from '../../store/api/ordersApi';
import { formatPrice } from '../../utils/formatPrice';
import { Link } from 'react-router-dom';

const STATUS_COLORS = { pending: 'text-yellow-400', confirmed: 'text-blue-400', shipped: 'text-purple-400', delivered: 'text-success', cancelled: 'text-sale' };

export default function AdminDashboard() {
  const { data: statsData } = useGetOrderStatsQuery();
  const { data: ordersData } = useGetOrdersQuery({ limit: 5 });
  const stats = statsData?.stats || {};
  const recentOrders = ordersData?.orders || [];

  const CARDS = [
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: '📦' },
    { label: 'Pending Orders', value: stats.pendingOrders || 0, icon: '⏳' },
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue || 0), icon: '💰' },
    { label: 'Active Products', value: stats.totalProducts || 0, icon: '🧢' },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl tracking-widest text-white mb-8">DASHBOARD</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CARDS.map(c => (
          <div key={c.label} className="bg-surface border border-border p-6">
            <p className="text-2xl mb-3">{c.icon}</p>
            <p className="text-white text-2xl font-bold mb-1">{c.value}</p>
            <p className="text-textSecondary text-xs tracking-wider uppercase">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-surface border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl tracking-widest text-white">RECENT ORDERS</h2>
          <Link to="/admin/orders" className="text-xs text-textSecondary hover:text-white tracking-wider uppercase">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              {['Order #', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs tracking-widest uppercase text-textSecondary font-semibold">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id} className="border-b border-border hover:bg-surfaceHover transition-colors">
                  <td className="px-6 py-4"><Link to={`/admin/orders/${o._id}`} className="text-white hover:underline font-mono text-xs">{o.orderNumber}</Link></td>
                  <td className="px-6 py-4 text-textSecondary">{o.customer.name}</td>
                  <td className="px-6 py-4 text-white">{formatPrice(o.total)}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-semibold uppercase tracking-wider ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                  <td className="px-6 py-4 text-textMuted text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {!recentOrders.length && <tr><td colSpan={5} className="px-6 py-8 text-center text-textMuted">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
