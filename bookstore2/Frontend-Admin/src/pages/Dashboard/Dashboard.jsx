import { useEffect, useState } from 'react';
import { DollarSign, BookOpen, ShoppingCart, AlertCircle, ArrowUpRight, Loader, TrendingUp, Users, Package } from 'lucide-react';
import { bookApi } from '../../api/bookApi';
import { categoryApi } from '../../api/categoryApi';
import { orderApi } from '../../api/orderApi';
import { userApi } from '../../api/userApi';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { id: 1, label: 'Doanh thu tháng', value: '---', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+0%' },
    { id: 2, label: 'Tổng đầu sách', value: '---', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', trend: '0 danh mục' },
    { id: 3, label: 'Đơn hàng mới', value: '---', icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+0 đơn' },
    { id: 4, label: 'Tồn kho thấp', value: '---', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Cần nhập hàng' },
  ]);
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [orderStatus, setOrderStatus] = useState({ cho_xu_ly: 0, dang_giao: 0, hoan_thanh: 0, da_huy: 0 });
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch books data
        const booksResponse = await bookApi.getBooks();
        const books = booksResponse.data.data || [];
        
        // Fetch categories
        const categoriesResponse = await categoryApi.getCategories();
        const categories = categoriesResponse.data.data || [];
        
        // Fetch orders
        const ordersResponse = await orderApi.getOrders();
        const orders = ordersResponse.data.data || [];

        // Fetch users for customer count
        const usersResponse = await userApi.getUsers();
        const users = usersResponse.data.data || [];
        const customers = users.filter(u => u.vai_tro === 'nguoi_dung').length;
        setTotalCustomers(customers);

        // Calculate stats
        const totalBooks = books.length;
        const lowStockBooks = books.filter(b => b.so_luong < 10).length;
        const totalOrdersCount = orders.length;
        const totalRevenue = orders.reduce((sum, order) => {
          const amount = parseFloat(order.tong_tien) || 0;
          return sum + amount;
        }, 0);

        // Format revenue with proper unit
        const revenueDisplay = totalRevenue >= 1000000 
          ? `${(totalRevenue / 1000000).toFixed(1)}M`
          : totalRevenue >= 1000
          ? `${(totalRevenue / 1000).toFixed(1)}K`
          : `${totalRevenue.toLocaleString()}đ`;

        setStats([
          { id: 1, label: 'Doanh thu tháng', value: revenueDisplay, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: `+${Math.round(totalRevenue / 100000)}%` },
          { id: 2, label: 'Tổng đầu sách', value: totalBooks.toString(), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', trend: `${categories.length} danh mục` },
          { id: 3, label: 'Đơn hàng mới', value: totalOrdersCount.toString(), icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50', trend: `+${totalOrdersCount} đơn` },
          { id: 4, label: 'Khách hàng', value: customers.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: `${customers} người` },
        ]);

        // Calculate order status
        const statusCount = {
          cho_xu_ly: orders.filter(o => o.trang_thai === 'cho_xu_ly').length,
          dang_giao: orders.filter(o => o.trang_thai === 'dang_giao').length,
          hoan_thanh: orders.filter(o => o.trang_thai === 'hoan_thanh').length,
          da_huy: orders.filter(o => o.trang_thai === 'da_huy').length,
        };
        setOrderStatus(statusCount);

        // Calculate top books from orders
        const bookSales = {};
        orders.forEach(order => {
          if (order.chi_tiet_don_hang) {
            order.chi_tiet_don_hang.forEach(detail => {
              const bookId = detail.sach_id;
              if (!bookSales[bookId]) {
                const book = books.find(b => b.id === bookId);
                bookSales[bookId] = {
                  id: bookId,
                  ten_sach: book?.ten_sach || 'Unknown',
                  quantity: 0,
                  revenue: 0
                };
              }
              bookSales[bookId].quantity += detail.so_luong || 0;
              bookSales[bookId].revenue += (parseFloat(detail.gia) * (detail.so_luong || 0)) || 0;
            });
          }
        });
        
        const topBooksData = Object.values(bookSales)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);
        setTopBooks(topBooksData);

        // Generate 7-day revenue data
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('vi-VN');
          const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
          
          const dayRevenue = orders
            .filter(o => new Date(o.ngay_tao).toLocaleDateString('vi-VN') === dateStr)
            .reduce((sum, o) => sum + (parseFloat(o.tong_tien) || 0), 0);
          
          last7Days.push({
            day: dayName,
            value: dayRevenue,
            label: dateStr.substring(0, 5)
          });
        }
        setRevenueData(last7Days);

        // Set recent activity
        const activities = orders.slice(0, 5).map((order, index) => ({
          id: order.id,
          text: `Đơn hàng #${order.id} - ${order.user?.ten || 'Unknown'}`,
          amount: `${(parseFloat(order.tong_tien) || 0).toLocaleString()}đ`,
          status: order.trang_thai,
          time: new Date(order.ngay_tao).toLocaleString('vi-VN')
        }));
        setRecentActivity(activities);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get status color and label
  const getStatusInfo = (status) => {
    const statusMap = {
      'cho_xu_ly': { label: '⏳ Chờ xử lý', color: 'text-amber-600', bg: 'bg-amber-50' },
      'dang_giao': { label: '🚚 Đang giao', color: 'text-blue-600', bg: 'bg-blue-50' },
      'hoan_thanh': { label: '✅ Hoàn thành', color: 'text-emerald-600', bg: 'bg-emerald-50' },
      'da_huy': { label: '❌ Đã hủy', color: 'text-rose-600', bg: 'bg-rose-50' }
    };
    return statusMap[status] || statusMap['cho_xu_ly'];
  };

  const maxRevenue = Math.max(...revenueData.map(d => d.value), 1);

  return (
    <div className="animate-in fade-in duration-500 text-left">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Tổng quan về kinh doanh hôm nay</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                {item.trend} <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-800">{loading ? <Loader size={16} className="animate-spin" /> : item.value}</h3>
              <p className="text-sm text-slate-500 mt-1">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue 7 Days */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" /> Doanh thu 7 ngày
              </h3>
              <p className="text-xs text-slate-500 mt-1">Tổng doanh thu theo từng ngày</p>
            </div>
          </div>

          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <Loader size={32} className="text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Chart bars */}
              <div className="flex items-end justify-between gap-2 h-40">
                {revenueData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer group relative"
                      style={{
                        height: `${(data.value / maxRevenue) * 120 + 20}px`,
                        minHeight: '20px'
                      }}
                      title={`${data.day}: ${(data.value / 1000000).toFixed(1)}M`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        {(data.value / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-600">{data.day}</p>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="pt-4 border-t flex gap-6 text-xs">
                <div>
                  <p className="text-slate-500">Cao nhất</p>
                  <p className="font-bold text-slate-800">{(maxRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-slate-500">Trung bình</p>
                  <p className="font-bold text-slate-800">{(revenueData.reduce((a, b) => a + b.value, 0) / 7 / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-6">
            <Package size={20} className="text-purple-600" /> Trạng thái đơn
          </h3>
          
          <div className="space-y-4">
            {[
              { key: 'cho_xu_ly', label: '⏳ Chờ xử lý', color: 'bg-amber-100', borderColor: 'border-amber-300' },
              { key: 'dang_giao', label: '🚚 Đang giao', color: 'bg-blue-100', borderColor: 'border-blue-300' },
              { key: 'hoan_thanh', label: '✅ Hoàn thành', color: 'bg-emerald-100', borderColor: 'border-emerald-300' },
              { key: 'da_huy', label: '❌ Đã hủy', color: 'bg-rose-100', borderColor: 'border-rose-300' },
            ].map((status) => {
              const count = orderStatus[status.key] || 0;
              const total = Object.values(orderStatus).reduce((a, b) => a + b, 1);
              const percentage = Math.round((count / total) * 100);
              
              return (
                <div key={status.key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">{status.label}</span>
                    <span className="text-sm font-bold text-slate-800">{count}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${status.color} overflow-hidden border ${status.borderColor}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-slate-600 to-slate-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{percentage}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Books & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Books */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-600" /> Sách bán chạy nhất
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size={24} className="text-blue-500 animate-spin" />
            </div>
          ) : topBooks.length === 0 ? (
            <p className="text-slate-500 text-sm py-8">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {topBooks.map((book, idx) => {
                const maxQty = Math.max(...topBooks.map(b => b.quantity), 1);
                const percentage = (book.quantity / maxQty) * 100;
                
                return (
                  <div key={book.id} className="group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{idx + 1}. {book.ten_sach}</p>
                        <p className="text-xs text-slate-500">Doanh thu: {(book.revenue / 1000000).toFixed(1)}M</p>
                      </div>
                      <span className="text-sm font-bold text-slate-600">{book.quantity} đơn</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full group-hover:from-emerald-600 group-hover:to-emerald-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <ShoppingCart size={20} className="text-blue-600" /> Hoạt động gần đây
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size={24} className="text-blue-500 animate-spin" />
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-slate-500 text-sm py-8">Chưa có hoạt động</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => {
                const statusInfo = getStatusInfo(activity.status);
                
                return (
                  <div key={activity.id} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-bold text-slate-800">{activity.text}</p>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusInfo.color} bg-opacity-10`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">{activity.amount}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{activity.time}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;