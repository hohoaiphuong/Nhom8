import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, Image as ImageIcon, Search, 
  Filter, Loader2, AlertCircle, Save, X 
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', 
    author: '', // Bổ sung Tác giả
    category_id: '', 
    price: '', 
    stock: '', 
    description: '', 
    image: null
  });

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const IMAGE_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace('/api','') + '/storage/';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookRes, catRes] = await Promise.all([
        axios.get(`${API_BASE}/books`),
        axios.get(`${API_BASE}/categories`)
      ]);
      setBooks(bookRes.data);
      setCategories(catRes.data);
    } catch (error) {
      toast.error("Không thể kết nối đến API Laravel!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title || '',
        author: book.author || '', // Bổ sung Tác giả khi sửa
        category_id: book.category_id || '',
        price: book.price || '',
        stock: book.stock || '',
        description: book.description || '',
        image: null
      });
      setPreviewImage(book.image ? `${IMAGE_BASE}${book.image}` : null);
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', category_id: '', price: '', stock: '', description: '', image: null });
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Đảm bảo dữ liệu gửi lên sạch sẽ
    data.append('title', formData.title || '');
    data.append('author', formData.author || ''); // Gửi author lên Backend
    data.append('category_id', formData.category_id || '');
    data.append('price', formData.price || 0);
    data.append('stock', formData.stock || 0);
    data.append('description', formData.description || '');
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingBook) {
        data.append('_method', 'PUT');
        // Ép kiểu ID về số nguyên để xóa bỏ dấu :1 rác
        const cleanId = parseInt(editingBook.id); 
        await axios.post(`${API_BASE}/books/${cleanId}`, data);
        toast.success("Cập nhật sách thành công!");
      } else {
        await axios.post(`${API_BASE}/books`, data);
        toast.success("Thêm sách mới thành công!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Lỗi Backend:", error.response?.data);
      toast.error("Lỗi dữ liệu! Hãy kiểm tra lại các ô nhập hoặc Console.");
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer theme="dark" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý kho sách</h1>
          <p className="text-slate-400 text-sm">Hiện có {books.length} đầu sách trong hệ thống</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={20} /> Thêm sách
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Sách</th>
              <th className="px-6 py-4">Tác giả</th>
              <th className="px-6 py-4 text-center">Tồn kho</th>
              <th className="px-6 py-4">Giá bán</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={40} />
                    <p className="text-slate-500 animate-pulse uppercase text-[10px] font-black">Đang quét kho...</p>
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <motion.tr key={book.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 shadow-md">
                          {book.image ? (
                            <img src={`${IMAGE_BASE}${book.image}`} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon size={18} /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{book.title}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black">{categories.find(c => c.id === book.category_id)?.name || 'Chưa phân loại'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm font-medium">{book.author || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${book.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        {book.stock} cuốn
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-emerald-400 font-bold">{Number(book.price).toLocaleString()}đ</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(book)} className="p-2 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-lg transition-all"><Edit3 size={18} /></button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-red-600 rounded-lg transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {editingBook ? <Edit3 size={20} className="text-indigo-400" /> : <Plus size={20} className="text-indigo-400" />}
                  {editingBook ? 'Cập nhật sách' : 'Thêm sách mới'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto text-left">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tên cuốn sách</label>
                  <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" 
                    value={formData.title || ''} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tác giả (Author)</label>
                  <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" 
                    value={formData.author || ''} 
                    onChange={(e) => setFormData({...formData, author: e.target.value})} 
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Danh mục</label>
                    <select required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none text-white appearance-none" 
                      value={formData.category_id || ''} 
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    >
                      <option value="">Chọn loại sách</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Giá (VNĐ)</label>
                      <input required type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 outline-none text-white" 
                        value={formData.price || ''} 
                        onChange={(e) => setFormData({...formData, price: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tồn kho</label>
                      <input required type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 outline-none text-white" 
                        value={formData.stock || ''} 
                        onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Ảnh bìa</label>
                  <div className="relative group h-full">
                    <div className="w-full h-44 bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-colors group-hover:border-indigo-500">
                      {previewImage ? (
                        <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          <ImageIcon className="text-slate-700 mb-2" size={32} />
                          <span className="text-[10px] text-slate-600 uppercase font-black">Chọn tệp ảnh</span>
                        </>
                      )}
                    </div>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button type="submit" className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-900/40 flex items-center gap-2 transition-all uppercase tracking-widest text-xs">
                    <Save size={18} /> {editingBook ? 'CẬP NHẬT' : 'KHỞI TẠO'}
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

export default Books;