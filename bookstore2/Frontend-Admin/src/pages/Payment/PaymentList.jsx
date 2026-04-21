import { useState, useEffect } from 'react';
import { CreditCard, Search, Filter, Eye, Loader, AlertCircle, TrendingUp } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import PaymentDetailModal from './PaymentDetailModal';

const PaymentList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalRevenue: 0
  });

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrders();
        const ordersData = response.data.data || [];
        setOrders(ordersData);
        
        // Calculate statistics
        const completed = ordersData.filter(o => o.payment?.trang_thai === 'da_thanh_toan').length;
        const pending = ordersData.filter(o => !o.payment || o.payment?.trang_thai !== 'da_thanh_toan').length;
        const totalRevenue = ordersData.reduce((sum, o) => sum + (o.tong_tien || 0), 0);

        setStats({
          total: ordersData.length,
          completed,
          pending,
          totalRevenue
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const customerName = order.user?.ten || order.ten_khach || '';
        return (
          order.id.toString().includes(searchTerm) ||
          customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => {
        if (statusFilter === 'da_thanh_toan') {
          return order.payment?.trang_thai === 'da_thanh_toan';
        } else if (statusFilter === 'cho_xu_ly') {
          return !order.payment || order.payment?.trang_thai !== 'da_thanh_toan';
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleViewPayment = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePaymentUpdateSuccess = (updatedOrder) => {
    // Update the order in the orders list
    const updatedOrders = orders.map(o => 
      o.id === updatedOrder.id ? updatedOrder : o
    );
    setOrders(updatedOrders);
    
    // Update statistics
    const completed = updatedOrders.filter(o => o.payment?.trang_thai === 'da_thanh_toan').length;
    const pending = updatedOrders.filter(o => !o.payment || o.payment?.trang_thai !== 'da_thanh_toan').length;
    const totalRevenue = updatedOrders.reduce((sum, o) => sum + (o.tong_tien || 0), 0);

    setStats({
      total: updatedOrders.length,
      completed,
      pending,
      totalRevenue
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="text-blue-600" /> Quản lý thanh toán
        </h1>
        <p className="text-slate-500 text-sm">Theo dõi và quản lý các khoản thanh toán từ đơn hàng.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-xs text-blue-600 font-bold uppercase">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-xs text-emerald-600 font-bold uppercase">Đã thanh toán</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-xs text-amber-600 font-bold uppercase">Chờ thanh toán</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-xs text-purple-600 font-bold uppercase">Doanh thu</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo mã đơn hoặc khách hàng..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="border border-slate-200 rounded-xl px-4 py-2 outline-none bg-white font-medium text-slate-600"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="da_thanh_toan">✅ Đã thanh toán</option>
          <option value="cho_xu_ly">⏳ Chờ thanh toán</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <Loader size={40} className="text-blue-500 animate-spin" />
            <p className="text-slate-400 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <AlertCircle size={40} className="text-rose-500" />
            <p className="text-slate-600 font-medium">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <AlertCircle size={40} className="text-slate-300" />
            <p className="text-slate-400 font-medium">Không tìm thấy đơn hàng nào.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4 text-left">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4 text-center">Phương thức</th>
                <th className="px-6 py-4 text-center">Số tiền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Ngày tạo</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">#{order.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{order.user?.ten || order.ten_khach || 'N/A'}</p>
                      <p className="text-xs text-slate-500">{order.user?.email || order.email || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      {order.payment?.phuong_thuc || '—'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="font-bold text-blue-600">
                      {(order.tong_tien || 0).toLocaleString()}đ
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${
                      order.payment?.trang_thai === 'da_thanh_toan'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {order.payment?.trang_thai === 'da_thanh_toan' ? '✅ Đã TT' : '⏳ Chờ TT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm text-slate-600">
                      {new Date(order.ngay_tao).toLocaleDateString('vi-VN')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleViewPayment(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <PaymentDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateSuccess={handlePaymentUpdateSuccess}
      />
    </div>
  );
};

export default PaymentList;
