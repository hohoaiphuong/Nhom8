import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { 
  DollarSign, ShoppingCart, Users, Package, 
  TrendingUp, ArrowUpRight, Calendar, Zap 
} from 'lucide-react';

// Dữ liệu giả lập cho biểu đồ (Sau này bạn sẽ fetch từ API Laravel)
const revenueData = [
  { name: 'T2', total: 4000 },
  { name: 'T3', total: 3000 },
  { name: 'T4', total: 5000 },
  { name: 'T5', total: 4500 },
  { name: 'T6', total: 6000 },
  { name: 'T7', total: 5500 },
  { name: 'CN', total: 7000 },
];

const topBooks = [
  { name: 'Đắc Nhân Tâm', sales: 150, color: '#6366f1' },
  { name: 'Nhà Giả Kim', sales: 120, color: '#a855f7' },
  { name: 'Lược Sử Loài Người', sales: 90, color: '#ec4899' },
  { name: 'Cha Giàu Cha Nghèo', sales: 70, color: '#f59e0b' },
];

// Component Thẻ thống kê (Stat Card)
const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
    className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl ${color}`} />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
          <ArrowUpRight size={12} /> {trend}
        </div>
      </div>
      <div className={`p-3 rounded-2xl bg-slate-800 text-white group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Zap className="text-yellow-400 fill-yellow-400" /> Trung tâm điều hành
          </h1>
          <p className="text-slate-500 mt-1">Dữ liệu được cập nhật thời gian thực từ hệ thống máy chủ.</p>
        </motion.div>
        
        <div className="flex gap-3 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/40 transition-all">Hôm nay</button>
          <button className="px-4 py-2 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all">Tháng này</button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Doanh thu tuần" value="45.200.000đ" icon={DollarSign} trend="+15.2%" color="bg-blue-500" delay={0.1} />
        <StatCard title="Đơn hàng mới" value="128" icon={ShoppingCart} trend="+8.4%" color="bg-purple-500" delay={0.2} />
        <StatCard title="Khách hàng" value="1.042" icon={Users} trend="+12.1%" color="bg-pink-500" delay={0.3} />
        <StatCard title="Sách sắp hết" value="12" icon={Package} trend="Cần nhập" color="bg-amber-500" delay={0.4} />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BIG REVENUE CHART */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-white">Phân tích tăng trưởng</h3>
              <p className="text-xs text-slate-500">Doanh thu 7 ngày gần nhất</p>
            </div>
            <Calendar className="text-slate-600" size={20} />
          </div>

          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* TOP BOOKS CHART */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex flex-col"
        >
          <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-400" /> Sách bán chạy
          </h3>
          
          <div className="flex-1 space-y-6">
            {topBooks.map((book, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">{book.name}</span>
                  <span className="text-white font-bold">{book.sales}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(book.sales / 150) * 100}%` }}
                    transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: book.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all border border-slate-700/50">
            Xem báo cáo chi tiết
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;