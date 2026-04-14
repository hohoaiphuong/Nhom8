import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      // Lưu thông tin để các trang khác sử dụng
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast.success(`Chào mừng ${res.data.user.name} đã quay lại!`);
      navigate('/'); 
    } catch (error) {
      toast.error("Email hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">Đăng nhập tài khoản</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email của bạn" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
            onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mật khẩu" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
            onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition">Vào cửa hàng</button>
        </form>
      </div>
    </div>
  );
}