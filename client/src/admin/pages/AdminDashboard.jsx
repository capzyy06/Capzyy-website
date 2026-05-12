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
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl sm:text-4xl tracking-widest text-white mb-6 sm:mb-8">DASHBOARD</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-10">
        {CARDS.map(c => (
          <div key={c.label} className="bg-surface border border-border p-4 sm:p-6">
            <p className="text-xl sm:text-2xl mb-2 sm:mb-3">{c.icon}</p>
            <p className="text-white text-xl sm:text-2xl font-bold mb-1">{c.value}</p>
            <p className="text-textSecondary text-[10px] sm:text-xs tracking-wider uppercase">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-surface border border-border">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <h2 className="font-display text-lg sm:text-xl tracking-widest text-white">RECENT ORDERS</h2>
          <Link to="/admin/orders" className="text-xs text-textSecondary hover:text-white tracking-wider uppercase">View All →</Link>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Order #', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs tracking-widest uppercase text-textSecondary font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
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
              {!recentOrders.length && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-textMuted">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-border">
          {recentOrders.map(o => (
            <div key={o._id} className="p-4 hover:bg-surfaceHover transition-colors">
              <div className="flex items-start justify-between mb-1.5">
                <Link to={`/admin/orders/${o._id}`} className="text-white hover:underline font-mono text-xs">{o.orderNumber}</Link>
                <span className={`text-xs font-semibold uppercase tracking-wider ${STATUS_COLORS[o.status]}`}>{o.status}</span>
              </div>
              <p className="text-textSecondary text-sm mb-1">{o.customer.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-white text-sm font-semibold">{formatPrice(o.total)}</p>
                <p className="text-textMuted text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          ))}
          {!recentOrders.length && (
            <p className="px-4 py-8 text-center text-textMuted text-sm">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
