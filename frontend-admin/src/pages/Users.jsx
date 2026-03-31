import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, UserCheck, ShieldCheck, 
  Trash2, Edit, Mail, Calendar, Loader2, 
  Search, X, Save, ShieldAlert 
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'customer'
  });

  const API_URL = "http://127.0.0.1:8000/api/users";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (error) {
      toast.error("Không thể truy xuất danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'customer' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser.id}`, formData);
        toast.success("Cập nhật tài khoản thành công!");
      } else {
        await axios.post(API_URL, formData);
        toast.success("Đã tạo tài khoản mới!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi: Email đã tồn tại hoặc dữ liệu không hợp lệ!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa tài khoản này khỏi hệ thống?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Đã xóa người dùng!");
        fetchUsers();
      } catch (error) {
        toast.error("Không thể xóa tài khoản quản trị!");
      }
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer theme="dark" />

      {/* HEADER & TỔNG QUAN NHANH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="text-indigo-500" size={32} /> Quản trị nhân sự
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Hệ thống đang quản lý <span className="text-indigo-400 font-bold">{users.length}</span> tài khoản hoạt động.
          </p>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
        >
          <UserPlus size={20} /> Cấp tài khoản mới
        </motion.button>
      </div>

      {/* DANH SÁCH NGƯỜI DÙNG */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 text-slate-500 text-[10px] uppercase tracking-[0.25em] font-black border-b border-slate-800">
              <th className="px-8 py-6">Thành viên</th>
              <th className="px-8 py-6">Liên hệ</th>
              <th className="px-8 py-6 text-center">Vai trò</th>
              <th className="px-8 py-6">Ngày gia nhập</th>
              <th className="px-8 py-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
                    <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Đang quét cơ sở dữ liệu...</p>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-indigo-600/5 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 font-black shadow-inner group-hover:border-indigo-500/50 transition-colors">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-slate-200 font-bold group-hover:text-white transition-colors">{user.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">ID: {user.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Mail size={14} className="text-indigo-500/50" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                          user.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {user.role === 'admin' ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={14} />
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(user)} className="p-2.5 bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-lg">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2.5 bg-slate-800 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-lg">
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

      {/* MODAL CÔNG NGHỆ (GLASSMORPHISM) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    {editingUser ? <Edit className="text-indigo-500" /> : <UserPlus className="text-indigo-500" />}
                    {editingUser ? 'Hiệu chỉnh' : 'Cấp mới'}
                  </h2>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Hồ sơ định danh bảo mật</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Họ và tên</label>
                  <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none text-white transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                  <input required type="email" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none text-white transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mật khẩu {editingUser && "(Bỏ trống nếu giữ cũ)"}</label>
                  <input required={!editingUser} type="password" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none text-white transition-all" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phân quyền</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none text-white appearance-none" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="customer">Khách hàng tiêu chuẩn</option>
                    <option value="admin">Quản trị viên hệ thống</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2 transition-all">
                    <Save size={20} /> {editingUser ? 'CẬP NHẬT' : 'KHỞI TẠO'}
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

export default UsersPage;