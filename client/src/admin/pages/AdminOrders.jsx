import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../store/api/ordersApi';
import { formatPrice } from '../../utils/formatPrice';
import Spinner from '../../components/common/Spinner';

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  shipped: 'text-purple-400 bg-purple-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
};

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetOrdersQuery({ status: statusFilter, search, limit: 30 });
  const orders = data?.orders || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl sm:text-4xl tracking-widest text-white mb-5 sm:mb-8">ORDERS</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 sm:mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search order number..."
          className="input-field w-full sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input-field w-full sm:w-40"
        >
          <option value="">All Status</option>
          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Spinner size="lg" className="py-20" />
      ) : (
        <>
          {/* Desktop table — hidden on mobile */}
          <div className="hidden md:block bg-surface border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Order #', 'Customer', 'Phone', 'Total', 'Status', 'Payment', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-textSecondary font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b border-border hover:bg-surfaceHover transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-white">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-white">{o.customer.name}</td>
                    <td className="px-4 py-3 text-textSecondary">{o.customer.phone}</td>
                    <td className="px-4 py-3 text-white font-semibold">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded ${STATUS_COLORS[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${o.paymentStatus === 'paid' ? 'text-success' : 'text-textMuted'}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-textMuted text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/orders/${o._id}`} className="text-xs text-textSecondary hover:text-white uppercase tracking-wider">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
                {!orders.length && (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-textMuted">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card list — shown below md */}
          <div className="md:hidden space-y-3">
            {!orders.length && (
              <p className="text-center text-textMuted py-12">No orders found</p>
            )}
            {orders.map(o => (
              <div key={o._id} className="bg-surface border border-border p-4 space-y-3">
                {/* Top row: order number + status */}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs text-white break-all leading-snug">{o.orderNumber}</span>
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded flex-shrink-0 ${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </span>
                </div>

                {/* Customer info */}
                <div className="flex flex-col gap-0.5">
                  <p className="text-white text-sm font-medium">{o.customer.name}</p>
                  <p className="text-textSecondary text-xs">{o.customer.phone}</p>
                </div>

                {/* Bottom row: total, payment, date, view */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm font-semibold">{formatPrice(o.total)}</span>
                    <span className={`text-xs ${o.paymentStatus === 'paid' ? 'text-success' : 'text-textMuted'}`}>
                      {o.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-textMuted text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
                    <Link
                      to={`/admin/orders/${o._id}`}
                      className="text-xs text-textSecondary hover:text-white uppercase tracking-wider min-h-[36px] flex items-center"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
