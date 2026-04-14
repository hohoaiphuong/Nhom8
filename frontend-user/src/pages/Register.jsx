import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL; // Lấy link Render

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/register`, data);
      localStorage.setItem('token', res.data.token);
      toast.success("Tạo tài khoản thành công!");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-pink-500">
        <h2 className="text-2xl font-bold text-center mb-6">Tham gia STU Book</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Họ và tên" className="w-full p-2 border rounded" 
            onChange={e => setData({...data, name: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" 
            onChange={e => setData({...data, email: e.target.value})} required />
          <input type="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" className="w-full p-2 border rounded" 
            onChange={e => setData({...data, password: e.target.value})} required />
          <input type="password" placeholder="Nhập lại mật khẩu" className="w-full p-2 border rounded" 
            onChange={e => setData({...data, password_confirmation: e.target.value})} required />
          <button className="w-full bg-pink-600 text-white py-2 rounded font-bold hover:bg-pink-700">Đăng ký ngay</button>
        </form>
      </div>
    </div>
  );
}