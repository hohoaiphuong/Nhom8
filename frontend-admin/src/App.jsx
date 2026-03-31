import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Layers, Users, ShoppingCart, 
  Warehouse, LogOut, Search, Bell, ChevronLeft, ChevronRight 
} from 'lucide-react';

// Import các trang của bạn
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Books from './pages/Books';
import UsersPage from './pages/Users';
import Orders from './pages/Orders';
import WarehousePage from './pages/Warehouse';

// Component Sidebar Item với hiệu ứng hoạt ảnh và hỗ trợ trạng thái thu gọn
const SidebarItem = ({ to, icon: Icon, label, active, collapsed }) => (
  <Link to={to} className="block">
    <motion.div
      whileHover={{ x: collapsed ? 0 : 10, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${
        collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
      } ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
          : 'text-slate-400 hover:text-indigo-400'
      }`}
    >
      <Icon size={collapsed ? 24 : 20} className={`${active ? 'animate-pulse' : ''} shrink-0`} />
      
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="font-medium whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {!collapsed && active && (
        <motion.div 
          layoutId="active-pill" 
          className="ml-auto w-1 h-5 bg-white rounded-full shrink-0" 
        />
      )}
    </motion.div>
  </Link>
);

const MainLayout = () => {
  const location = useLocation();
  // State quản lý trạng thái thu gọn của sidebar
  const [collapsed, setCollapsed] = useState(false);

  // Cấu hình hoạt ảnh cho sidebar khi thu gọn/mở rộng
  const sidebarVariants = {
    expanded: { width: "18rem", transition: { duration: 0.3, ease: "circOut" } },
    collapsed: { width: "5rem", transition: { duration: 0.3, ease: "circOut" } }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* SIDEBAR - GIAO DIỆN TỐI VÀ HOẠT ẢNH THU GỌN */}
      <motion.aside 
        initial="expanded"
        animate={collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="bg-slate-900 border-r border-slate-800 p-4 flex flex-col sticky top-0 h-screen z-50 overflow-hidden"
      >
        {/* Logo và Nút Thu Gọn */}
        <div className={`flex items-center mb-10 ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/50">
              <BookOpen size={24} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent whitespace-nowrap"
                >
                  STU BOOK <span className="text-indigo-500">.</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          {/* Nút điều khiển thu gọn sidebar */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Các mục điều hướng */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-1 -mr-1">
          <SidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/admin'} collapsed={collapsed} />
          <SidebarItem to="/admin/categories" icon={Layers} label="Danh mục" active={location.pathname === '/admin/categories'} collapsed={collapsed} />
          <SidebarItem to="/admin/books" icon={BookOpen} label="Quản lý sách" active={location.pathname === '/admin/books'} collapsed={collapsed} />
          <SidebarItem to="/admin/users" icon={Users} label="Người dùng" active={location.pathname === '/admin/users'} collapsed={collapsed} />
          <SidebarItem to="/admin/orders" icon={ShoppingCart} label="Đơn hàng" active={location.pathname === '/admin/orders'} collapsed={collapsed} />
          <SidebarItem to="/admin/warehouse" icon={Warehouse} label="Kho hàng" active={location.pathname === '/admin/warehouse'} collapsed={collapsed} />
        </nav>

        {/* Nút Đăng xuất */}
        <div className="mt-auto pt-4 border-t border-slate-800">
          <button className={`flex items-center gap-3 text-red-400 hover:bg-red-950/50 w-full rounded-xl transition-all ${collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}`}>
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </motion.aside>

      {/* VÙNG NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col">
        {/* HEADER GIAO DIỆN TỐI */}
        <header className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm dữ liệu hệ thống..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-900 focus:border-indigo-700 outline-none text-sm text-slate-200 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative text-slate-500 hover:text-indigo-400 cursor-pointer transition">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-slate-950 font-bold">3</span>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-200">Tuan Anh</p>
                <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Senior Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-slate-800 shadow-md flex items-center justify-center text-white font-bold text-sm">TA</div>
            </div>
          </div>
        </header>

        {/* NỘI DUNG TRANG VỚI HIỆU ỨNG CHUYỂN CẢNH SỐNG ĐỘNG */}
        <main className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Routes>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/categories" element={<Categories />} />
                <Route path="/admin/books" element={<Books />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/orders" element={<Orders />} />
                <Route path="/admin/warehouse" element={<WarehousePage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;