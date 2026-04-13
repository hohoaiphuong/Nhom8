import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Warehouse, PackagePlus, AlertTriangle, CheckCircle2, 
  History, Search, Plus, Minus, Save, X, Loader2, BarChart3 
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const WarehousePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importQty, setImportQty] = useState(0);

  const API_URL = "http://https://nhom8-backend-admin.onrender.com/api/books";

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setBooks(res.data);
    } catch (error) {
      toast.error("Lỗi truy xuất dữ liệu kho!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const openImportModal = (book) => {
    setSelectedBook(book);
    setImportQty(0);
    setIsModalOpen(true);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (importQty <= 0) return toast.warning("Số lượng phải lớn hơn 0");

    try {
      const newStock = Number(selectedBook.stock) + Number(importQty);
      await axios.put(`${API_URL}/${selectedBook.id}`, { 
        ...selectedBook, 
        stock: newStock 
      });
      toast.success(`Đã nhập thêm ${importQty} cuốn vào kho!`);
      setIsModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error("Lỗi cập nhật kho hàng!");
    }
  };

  // Logic xác định trạng thái tồn kho "Hitech"
  const getStockInfo = (stock) => {
    if (stock <= 0) return { label: 'Hết hàng', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', percent: 0 };
    if (stock < 10) return { label: 'Sắp hết', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', percent: (stock / 50) * 100 };
    return { label: 'An toàn', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', percent: 100 };
  };

  return (
    <div className="space-y-8 pb-10">
      <ToastContainer theme="dark" />

      {/* HEADER & QUICK STATS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Warehouse className="text-indigo-500" size={32} /> Kiểm soát tồn kho
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Giám sát lưu lượng hàng hóa và điều phối nhập kho.</p>
        </motion.div>

        <div className="flex gap-4">
           <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl"><AlertTriangle size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cần nhập gấp</p>
                <p className="text-xl font-bold text-white">{books.filter(b => b.stock < 10).length}</p>
              </div>
           </div>
           <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><BarChart3 size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tổng đầu sách</p>
                <p className="text-xl font-bold text-white">{books.length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 text-slate-500 text-[10px] uppercase tracking-[0.25em] font-black border-b border-slate-800">
              <th className="px-8 py-6">Sách trong kho</th>
              <th className="px-8 py-6">Mức độ tồn kho</th>
              <th className="px-8 py-6 text-center">Số lượng</th>
              <th className="px-8 py-6">Trạng thái</th>
              <th className="px-8 py-6 text-right">Nhập hàng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Đang quét mã vạch hệ thống...</p>
                  </td>
                </tr>
              ) : (
                books.map((book, index) => {
                  const status = getStockInfo(book.stock);
                  return (
                    <motion.tr 
                      key={book.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-indigo-600/5 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-12 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 shadow-lg group-hover:border-indigo-500/50 transition-colors">
                             <img src={`http://https://nhom8-backend-admin.onrender.com/storage/${book.image}`} className="w-full h-full object-cover opacity-80" alt="" />
                          </div>
                          <span className="text-slate-200 font-bold text-sm">{book.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 w-64">
                         <div className="space-y-2">
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${status.percent}%` }}
                                 className={`h-full rounded-full ${status.color.replace('text-', 'bg-')}`}
                               />
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase italic">Dung lượng kho hiện tại</p>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`text-2xl font-black font-mono ${status.color}`}>
                          {book.stock.toString().padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border tracking-widest ${status.bg} ${status.color} ${status.border}`}>
                           {book.stock < 10 ? <AlertTriangle size={12}/> : <CheckCircle2 size={12}/>} {status.label}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => openImportModal(book)}
                          className="p-3 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-lg border border-indigo-500/20"
                        >
                          <PackagePlus size={20} />
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

      {/* MODAL NHẬP KHO (QUICK ACTION) */}
      <AnimatePresence>
        {isModalOpen && selectedBook && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[3rem] shadow-2xl relative z-10 overflow-hidden p-10"
            >
              <div className="text-center space-y-4 mb-8">
                <div className="w-20 h-20 bg-indigo-600/20 text-indigo-500 rounded-3xl mx-auto flex items-center justify-center border border-indigo-500/30">
                   <Warehouse size={40} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Cập nhật số lượng</h2>
                  <p className="text-slate-500 text-sm italic font-medium">{selectedBook.title}</p>
                </div>
              </div>

              <form onSubmit={handleImport} className="space-y-8">
                <div className="relative flex items-center justify-between bg-slate-950 p-4 rounded-3xl border border-slate-800">
                  <button type="button" onClick={() => setImportQty(Math.max(0, importQty - 1))} className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-700"><Minus size={20}/></button>
                  <input 
                    type="number" required
                    className="w-20 bg-transparent text-center text-4xl font-black text-indigo-400 outline-none"
                    value={importQty}
                    onChange={(e) => setImportQty(e.target.value)}
                  />
                  <button type="button" onClick={() => setImportQty(importQty + 1)} className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-700"><Plus size={20}/></button>
                </div>

                <div className="text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Dự kiến tồn kho mới</p>
                   <span className="text-3xl font-black text-emerald-400">
                      {Number(selectedBook.stock) + Number(importQty)} cuốn
                   </span>
                </div>

                <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 transition-all">
                  <Save size={20} /> XÁC NHẬN NHẬP KHO
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WarehousePage;