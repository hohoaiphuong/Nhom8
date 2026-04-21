import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { useLogout } from '../hooks/useLogout';

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout();

  // Protect route - if no token or not admin, redirect to login
  React.useEffect(() => {
    console.log('📍 AdminLayout useEffect running');
    const token = localStorage.getItem('token');
    const adminRole = localStorage.getItem('adminRole');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    console.log('🔍 AdminLayout auth check:', { 
      token: token ? token.substring(0, 10) + '...' : 'NULL', 
      adminRole, 
      userId, 
      userName 
    });
    
    if (!token || !adminRole) {
      console.error('❌ REDIRECT TO LOGIN: No token/adminRole detected');
      console.error('   token:', token);
      console.error('   adminRole:', adminRole);
      navigate('/login');
      return;
    }
    
    console.log('✅ Auth passed, staying on admin page');
  }, [navigate]);

  // Get user info from localStorage after first render
  const [userInfo, setUserInfo] = useState({
    userId: localStorage.getItem('userId'),
    userName: localStorage.getItem('userName')
  });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700">Trang quản trị hệ thống</h2>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{userInfo.userName || 'Quản trị viên'}</p>
                <p className="text-xs text-slate-500">ID: {userInfo.userId}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                ⚙️
              </div>
              <ChevronDown size={16} className="text-slate-600" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-700">Admin Account</p>
                  <p className="text-xs text-slate-500 mt-1">{userInfo.userId ? `ID: ${userInfo.userId}` : 'Không xác định'}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Nội dung chính */}
        <main className="p-6 md:p-10 flex-grow">
          <Outlet />
        </main>

        <footer className="p-4 text-center text-slate-400 text-xs bg-white border-t">
          © 2026 Bookstore Management System - Powered by React & Tailwind
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;