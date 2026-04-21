import { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Search, Filter, CheckCircle2, Clock, XCircle, Truck, Loader, AlertCircle } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import { orderApi } from '../../api/orderApi';
import { formatCurrency } from '../../utils/formatCurrency';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrders();
        const orderData = response.data.data || [];
        setOrders(orderData);
        setFilteredOrders(orderData);
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
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        (order.user && order.user.ten && order.user.ten.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.ten_khach && order.ten_khach.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.trang_thai === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // Helper hiển thị Badge trạng thái
  const getStatusBadge = (status) => {
    const config = {
      'cho_xu_ly': { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock, label: 'Chờ xử lý' },
      'dang_giao': { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Truck, label: 'Đang giao' },
      'hoan_thanh': { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2, label: 'Đã giao' },
      'da_huy': { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: XCircle, label: 'Đã hủy' },
    };
    const { color, icon: Icon, label } = config[status] || config['cho_xu_ly'];
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
        <Icon size={14} /> {label}
      </span>
    );
  };

  // Handle order status update
  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, trang_thai: newStatus } : order
      )
    );
    setSelectedOrder(prev => prev ? { ...prev, trang_thai: newStatus } : null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" /> Quản lý đơn hàng
        </h1>
        <p className="text-sm text-slate-500">Theo dõi và xử lý các đơn đặt hàng từ khách hàng.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo mã đơn, khách hàng..." 
            className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
          <option value="cho_xu_ly">Chờ xử lý</option>
          <option value="dang_giao">Đang giao</option>
          <option value="hoan_thanh">Đã giao</option>
          <option value="da_huy">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
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
        ) : (
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4 text-center">Ngày đặt</th>
              <th className="px-6 py-4 text-right">Tổng tiền</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">#{order.id}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{order.user?.ten || order.ten_khach || 'Khách vãng lai'}</td>
                <td className="px-6 py-4 text-center text-sm text-slate-500">{new Date(order.ngay_tao).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4 text-right font-bold text-blue-600">{formatCurrency(order.tong_tien)}</td>
                <td className="px-6 py-4 flex justify-center">{getStatusBadge(order.trang_thai)}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {!loading && filteredOrders.length === 0 && !error && (
        <div className="py-20 text-center flex flex-col items-center gap-2">
          <AlertCircle size={40} className="text-slate-300" />
          <p className="text-slate-400 font-medium">Không tìm thấy đơn hàng nào.</p>
        </div>
      )}

      <OrderDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default OrderList;