import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Eye, CheckCircle2, Clock, 
  Truck, XCircle, Receipt, Calendar, 
  User, MapPin, Phone, Loader2, Save, X 
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = "http://HTTPS://NHOM8-BACKEND-ADMIN.ONRENDER.COM/api/orders";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setOrders(res.data);
    } catch (error) {
      toast.error("Không thể kết nối máy chủ đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/${orderId}/status`, { status: newStatus });
      toast.success(`Trạng thái cập nhật: ${newStatus.toUpperCase()}`);
      fetchOrders();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái!");
    }
  };

  const openDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Hàm định nghĩa màu sắc Neon cho từng trạng thái
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { label: 'Chờ duyệt', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: <Clock size={12} /> };
      case 'processing': return { label: 'Đang xử lý', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: <Truck size={12} /> };
      case 'completed': return { label: 'Hoàn thành', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: <CheckCircle2 size={12} /> };
      case 'cancelled': return { label: 'Đã hủy', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', icon: <XCircle size={12} /> };
      default: return { label: 'Không xác định', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20', icon: null };
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <ToastContainer theme="dark" />

      {/* HEADER & QUẢN LÝ TỔNG QUAN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Receipt className="text-indigo-500" size={32} /> Quản lý giao dịch
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium italic">Theo dõi luồng vận hành và chốt đơn hàng.</p>
        </motion.div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-4 shadow-xl">
           <div className="flex flex-col border-r border-slate-800 pr-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tổng đơn</span>
              <span className="text-lg font-bold text-indigo-400">{orders.length}</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Chờ xử lý</span>
              <span className="text-lg font-bold text-amber-400">{orders.filter(o => o.status === 'pending').length}</span>
           </div>
        </div>
      </div>

      {/* BẢNG ĐƠN HÀNG HITECH */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 text-slate-500 text-[10px] uppercase tracking-[0.25em] font-black border-b border-slate-800">
              <th className="px-8 py-6">Mã Đơn</th>
              <th className="px-8 py-6">Khách hàng</th>
              <th className="px-8 py-6">Tổng thanh toán</th>
              <th className="px-8 py-6 text-center">Trạng thái</th>
              <th className="px-8 py-6 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Đang nạp dữ liệu giao dịch...</p>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const status = getStatusConfig(order.status);
                  return (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-indigo-600/5 transition-colors group"
                    >
                      <td className="px-8 py-6 font-mono text-indigo-400 font-bold">#{order.id.toString().padStart(5, '0')}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-indigo-500/50 transition-colors">
                            <User size={18} />
                          </div>
                          <span className="text-slate-200 font-bold">{order.user_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-rose-500 text-lg">
                        {Number(order.total_price).toLocaleString()}đ
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border tracking-widest ${status.bg} ${status.color} ${status.border} shadow-sm`}>
                            {status.icon} {status.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => openDetail(order)}
                          className="p-3 bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-lg"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG (GIỎ HÀNG) */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Đơn hàng #{selectedOrder.id}</h2>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Thời gian đặt: {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-full transition-colors"><X size={24} /></button>
              </div>

              {/* Modal Content */}
              <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Thông tin giao hàng */}
                <div className="space-y-6">
                   <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 space-y-4">
                      <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                         <User size={14} /> Khách hàng
                      </h3>
                      <p className="text-white font-bold">{selectedOrder.user_name}</p>
                      <p className="text-slate-400 text-sm flex items-center gap-2"><Phone size={12} /> {selectedOrder.phone}</p>
                      <p className="text-slate-400 text-sm flex items-start gap-2"><MapPin size={12} className="mt-1 shrink-0" /> {selectedOrder.address}</p>
                   </div>

                   {/* Trạng thái hiện tại */}
                   <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Điều hướng đơn hàng</h3>
                      <div className="grid grid-cols-1 gap-3">
                         <button onClick={() => updateStatus(selectedOrder.id, 'processing')} className="py-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            <Truck size={16} /> DUYỆT ĐƠN
                         </button>
                         <button onClick={() => updateStatus(selectedOrder.id, 'completed')} className="py-3 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            <CheckCircle2 size={16} /> HOÀN TẤT
                         </button>
                         <button onClick={() => updateStatus(selectedOrder.id, 'cancelled')} className="py-3 bg-rose-600/10 text-rose-400 border border-rose-500/20 rounded-xl font-bold text-xs hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            <XCircle size={16} /> HỦY GIAO DỊCH
                         </button>
                      </div>
                   </div>
                </div>

                {/* Danh sách sản phẩm (Giỏ hàng đã chốt) */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-slate-950/50 rounded-[2rem] border border-slate-800 overflow-hidden">
                      <table className="w-full text-left text-sm">
                         <thead className="bg-slate-800/30 text-slate-500 text-[10px] uppercase font-black">
                            <tr>
                               <th className="px-6 py-4">Tên Sách</th>
                               <th className="px-6 py-4 text-center">SL</th>
                               <th className="px-6 py-4 text-right">Đơn giá</th>
                               <th className="px-6 py-4 text-right">Tổng</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800/50">
                            {selectedOrder.items.map((item, idx) => (
                               <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                                  <td className="px-6 py-5 text-slate-200 font-bold">{item.book_title}</td>
                                  <td className="px-6 py-5 text-center font-mono text-indigo-400">x{item.quantity}</td>
                                  <td className="px-6 py-5 text-right text-slate-400">{Number(item.price).toLocaleString()}đ</td>
                                  <td className="px-6 py-5 text-right text-white font-black">{(item.quantity * item.price).toLocaleString()}đ</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                   
                   <div className="flex justify-between items-center bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[2rem]">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tổng giá trị đơn hàng</span>
                      <span className="text-3xl font-black text-white">{Number(selectedOrder.total_price).toLocaleString()}đ</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;