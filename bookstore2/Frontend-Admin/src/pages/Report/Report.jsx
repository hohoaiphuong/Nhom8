import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, ArrowUpRight, ArrowDownRight, Loader, AlertCircle } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { bookApi } from '../../api/bookApi';

const Report = () => {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30'); // days
  
  // Statistics
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successfulOrders: 0,
    avgOrderValue: 0,
    revenueTrend: 0,
    orderTrend: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [topBooks, setTopBooks] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch orders
        const orderResponse = await orderApi.getOrders();
        const allOrders = orderResponse.data.data || [];
        
        // Fetch books
        const bookResponse = await bookApi.getBooks();
        const allBooks = bookResponse.data.data || [];
        
        setOrders(allOrders);
        setBooks(allBooks);
        
        // Calculate statistics
        calculateStats(allOrders, allBooks);
        calculateRevenueData(allOrders);
        calculateTopBooks(allOrders, allBooks);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Không thể tải dữ liệu báo cáo');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (allOrders, allBooks) => {
    // Filter by date range - include all orders except cancelled
    const now = new Date();
    const daysAgo = new Date(now.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
    
    const filteredOrders = allOrders.filter(order => 
      new Date(order.ngay_tao) >= daysAgo && order.trang_thai !== 'da_huy'
    );

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (parseFloat(order.tong_tien) || 0), 0);
    const successfulOrders = allOrders.filter(order => order.trang_thai === 'hoan_thanh' && new Date(order.ngay_tao) >= daysAgo).length;
    const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

    // Calculate trend (compare with previous period)
    const previousDaysAgo = new Date(now.getTime() - parseInt(dateRange) * 2 * 24 * 60 * 60 * 1000);
    const prevOrders = allOrders.filter(order => 
      new Date(order.ngay_tao) >= previousDaysAgo && 
      new Date(order.ngay_tao) < daysAgo &&
      order.trang_thai !== 'da_huy'
    );
    const prevRevenue = prevOrders.reduce((sum, order) => sum + (parseFloat(order.tong_tien) || 0), 0);
    const revenueTrend = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue * 100) : 0;
    const orderTrend = prevOrders.length > 0 ? ((filteredOrders.length - prevOrders.length) / prevOrders.length * 100) : 0;

    setStats({
      totalRevenue,
      successfulOrders,
      avgOrderValue,
      revenueTrend: Math.round(revenueTrend),
      orderTrend: Math.round(orderTrend)
    });
  };

  const calculateRevenueData = (allOrders) => {
    const now = new Date();
    const days = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    // Get last 7 days - include all orders except cancelled
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayOrders = allOrders.filter(order => 
        new Date(order.ngay_tao) >= dayStart && 
        new Date(order.ngay_tao) <= dayEnd &&
        order.trang_thai !== 'da_huy'
      );
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + (parseFloat(order.tong_tien) || 0), 0);
      days.push({
        day: dayNames[new Date(dayStart).getDay()],
        value: dayRevenue / 1000000, // Convert to millions
        actual: dayRevenue
      });
    }
    
    setRevenueData(days);
  };

  const calculateTopBooks = (allOrders, allBooks) => {
    const bookSales = {};
    
    allOrders.forEach(order => {
      // Exclude cancelled orders
      if (order.trang_thai === 'da_huy') return;
      
      const details = order.chi_tiet_don_hang || [];
      details.forEach(detail => {
        if (!bookSales[detail.sach_id]) {
          const book = allBooks.find(b => b.id === detail.sach_id);
          bookSales[detail.sach_id] = {
            id: detail.sach_id,
            name: book?.ten_sach || 'Unknown',
            sales: 0,
            revenue: 0
          };
        }
        bookSales[detail.sach_id].sales += detail.so_luong || 0;
        bookSales[detail.sach_id].revenue += (parseFloat(detail.gia) * (detail.so_luong || 0)) || 0;
      });
    });
    
    const top = Object.values(bookSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    setTopBooks(top);
  };

  const maxRevenue = Math.max(...revenueData.map(d => d.value), 1);

  const handleExport = () => {
    // Simple CSV export
    let csv = 'Báo cáo doanh thu\n\n';
    csv += `Tổng doanh thu,${stats.totalRevenue.toLocaleString()}đ\n`;
    csv += `Đơn hàng thành công,${stats.successfulOrders}\n`;
    csv += `Giá trị trung bình,${Math.round(stats.avgOrderValue).toLocaleString()}đ\n\n`;
    csv += 'Doanh thu theo ngày\n';
    csv += 'Ngày,Doanh thu (M đ)\n';
    revenueData.forEach(d => {
      csv += `${d.day},${d.value.toFixed(2)}\n`;
    });
    csv += '\nSách bán chạy\n';
    csv += 'Tên sách,Số lượng bán,Doanh thu\n';
    topBooks.forEach(b => {
      csv += `${b.name},${b.sales},${b.revenue.toLocaleString()}đ\n`;
    });
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `report_${new Date().toISOString().slice(0, 10)}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-2">
        <Loader size={40} className="text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium">Đang tải báo cáo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-2">
        <AlertCircle size={40} className="text-rose-500" />
        <p className="text-slate-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-blue-600" /> Báo cáo & Thống kê
          </h1>
          <p className="text-sm text-slate-500">Phân tích hiệu suất kinh doanh và doanh thu shop.</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              calculateStats(orders, books);
              calculateRevenueData(orders);
            }}
          >
            <option value="7">7 ngày qua</option>
            <option value="30">30 ngày qua</option>
            <option value="90">90 ngày qua</option>
            <option value="365">1 năm qua</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <Download size={18} /> Xuất CSV
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tổng doanh thu</p>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-3xl font-black text-slate-800">{(stats.totalRevenue / 1000000).toFixed(1)}M đ</h3>
            <span className={`text-sm font-bold flex items-center mb-1 ${stats.revenueTrend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {stats.revenueTrend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} 
              {Math.abs(stats.revenueTrend)}%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Đơn hàng thành công</p>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-3xl font-black text-slate-800">{stats.successfulOrders}</h3>
            <span className={`text-sm font-bold flex items-center mb-1 ${stats.orderTrend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {stats.orderTrend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} 
              {Math.abs(stats.orderTrend)}%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Giá trị trung bình</p>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-3xl font-black text-slate-800">{Math.round(stats.avgOrderValue / 1000)}k đ</h3>
            <span className="text-slate-500 text-sm font-bold">/ đơn hàng</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800">Doanh thu 7 ngày gần nhất</h3>
            <TrendingUp size={20} className="text-blue-500" />
          </div>
          <div className="flex items-end justify-between h-48 gap-1.5">
            {revenueData.map((data, idx) => {
              const heightPercent = maxRevenue > 0 ? (data.value / maxRevenue) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-blue-100 rounded-t-lg group-hover:bg-blue-500 transition-all duration-300 relative cursor-pointer"
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.value.toFixed(1)}M đ
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{data.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Books */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Top sách bán chạy</h3>
          <div className="space-y-4">
            {topBooks.length > 0 ? (
              topBooks.map((book, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{book.name}</p>
                      <p className="text-xs text-slate-400">{book.sales} cuốn bán</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-700 text-sm ml-2">{(book.revenue / 1000000).toFixed(1)}M đ</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-6">Chưa có dữ liệu bán hàng</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Tổng quan đơn hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 font-bold">Tất cả đơn hàng</p>
            <p className="text-2xl font-black text-blue-900 mt-2">{orders.length}</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600 font-bold">Đã hoàn thành</p>
            <p className="text-2xl font-black text-emerald-900 mt-2">{orders.filter(o => o.trang_thai === 'hoan_thanh').length}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-600 font-bold">Đang giao hàng</p>
            <p className="text-2xl font-black text-amber-900 mt-2">{orders.filter(o => o.trang_thai === 'dang_giao').length}</p>
          </div>
          <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
            <p className="text-xs text-rose-600 font-bold">Đã hủy</p>
            <p className="text-2xl font-black text-rose-900 mt-2">{orders.filter(o => o.trang_thai === 'da_huy').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;