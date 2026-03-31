import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Plus, Edit3, Trash2, Search, 
  Loader2, FolderPlus, Save, X, AlertCircle 
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const API_URL = "http://127.0.0.1:8000/api/categories";

  // 1. Lấy danh sách danh mục với hiệu ứng Loading
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (error) {
      toast.error("Lỗi kết nối server Laravel!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // 2. Xử lý Modal
  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  // 3. Thêm hoặc Cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/${editingCategory.id}`, formData);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await axios.post(API_URL, formData);
        toast.success("Đã thêm danh mục mới!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi dữ liệu, vui lòng kiểm tra lại!");
    }
  };

  // 4. Xóa danh mục
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Đã xóa danh mục!");
        fetchCategories();
      } catch (error) {
        toast.error("Không thể xóa danh mục đang có sách!");
      }
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer theme="dark" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Layers className="text-indigo-500" size={32} /> Phân loại danh mục
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Quản lý cấu trúc phân loại cho các đầu sách trong hệ thống.</p>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all"
        >
          <Plus size={20} /> Thêm danh mục mới
        </motion.button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/40 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
              <th className="px-8 py-5">STT</th>
              <th className="px-8 py-5">Tên danh mục</th>
              <th className="px-8 py-5">Mô tả chi tiết</th>
              <th className="px-8 py-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
                    <p className="text-slate-500 font-bold animate-pulse uppercase text-xs tracking-widest">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <AlertCircle className="text-slate-700 mx-auto mb-4" size={48} />
                    <p className="text-slate-500 font-bold">Dữ liệu danh mục đang trống.</p>
                  </td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <motion.tr 
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-8 py-5 text-slate-500 font-mono text-sm">{index + 1}</td>
                    <td className="px-8 py-5">
                      <span className="text-slate-200 font-bold group-hover:text-indigo-400 transition-colors">
                        {cat.name}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-slate-500 text-sm italic truncate max-w-xs">
                        {cat.description || "Không có mô tả..."}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => openModal(cat)}
                          className="p-2.5 bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2.5 bg-slate-800 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* MODAL CÔNG NGHỆ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, rotateX: -20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-800 bg-slate-800/30">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <FolderPlus className="text-indigo-500" />
                  {editingCategory ? 'Chỉnh sửa' : 'Thêm mới'}
                </h2>
                <p className="text-slate-500 text-xs mt-2 uppercase tracking-tighter">Thông tin định danh danh mục</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Tên danh mục</label>
                  <input 
                    required type="text" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none text-white transition-all placeholder:text-slate-700"
                    placeholder="Ví dụ: Kỹ năng sống, Công nghệ..."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Mô tả ngắn</label>
                  <textarea 
                    rows="4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none text-white transition-all placeholder:text-slate-700"
                    placeholder="Nhập mô tả cho danh mục này..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-800 rounded-2xl transition-all"
                  >Hủy bỏ</button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> {editingCategory ? 'Cập nhật' : 'Khởi tạo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;