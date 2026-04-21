import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/authApi';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    mat_khau: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.mat_khau) {
      newErrors.mat_khau = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      const response = await authApi.login({
        email: formData.email,
        mat_khau: formData.mat_khau
      });

      console.log('Login response:', response.data);

      if (response.data.success && response.data.data) {
        const { id, api_token, vai_tro, ten } = response.data.data;
        
        console.log('User data:', { id, api_token, vai_tro, ten });
        const isAdmin = vai_tro === 'quan_tri' || vai_tro === 'admin';
        console.log('vai_tro check - is admin:', isAdmin, '(vai_tro=' + vai_tro + ')');
        
        // Kiểm tra xem có phải admin/quan_tri không
        if (!isAdmin) {
          console.warn('User role not admin/quan_tri, rejecting login');
          setGeneralError('Bạn không có quyền truy cập trang quản trị');
          setLoading(false);
          return;
        }
        
        // Lưu token, userId, tên và role vào localStorage
        localStorage.setItem('token', api_token);
        localStorage.setItem('userId', id);
        localStorage.setItem('userName', ten);
        localStorage.setItem('adminRole', vai_tro);
        
        console.log('✅ Admin login successful, localStorage set, redirecting to /');
        setLoading(false);
        
        // Redirect tới dashboard
        navigate('/');
      } else {
        setGeneralError(response.data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Response data:', error.response?.data);
      
      if (error.response?.status === 401) {
        setGeneralError(error.response?.data?.message || 'Email hoặc mật khẩu không đúng');
      } else if (error.response?.status === 422) {
        setGeneralError(error.response?.data?.message || 'Email hoặc mật khẩu không đúng');
      } else {
        setGeneralError(error.response?.data?.message || 'Lỗi đăng nhập. Vui lòng thử lại.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-indigo-500 mb-2">📊</div>
          <h1 className="text-3xl font-bold text-white mb-2">Bookstore Admin</h1>
          <p className="text-slate-300">Trang quản trị hệ thống</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Error Message */}
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {generalError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Quản trị viên
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg outline-none transition-all ${
                    errors.email
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                  placeholder="admin@gmail.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="mat_khau"
                  value={formData.mat_khau}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg outline-none transition-all ${
                    errors.mat_khau
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.mat_khau && (
                <p className="mt-1 text-sm text-red-600">{errors.mat_khau}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                '🔐 Đăng nhập'
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              💡 Tài khoản admin:
            </p>
            <p className="text-center text-xs text-slate-500 mt-2">
              <code className="bg-slate-100 px-2 py-1 rounded">admin@gmail.com</code>
            </p>
            <p className="text-center text-xs text-slate-500">
              <code className="bg-slate-100 px-2 py-1 rounded">123456</code>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>🔒 Trang quản trị được bảo vệ - Chỉ admin có thể truy cập</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
