import { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MoreHorizontal, UserX, UserCheck, ShieldCheck, Loader, AlertCircle, Edit, Trash2, Plus } from 'lucide-react';
import { userApi } from '../../api/userApi';

const CustomerList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [stats, setStats] = useState(null);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userApi.getUsers();
        setUsers(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Không thể tải danh sách khách hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userApi.getStatistics();
        setStats(response.data.data || null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
      }
    };

    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa người dùng này?')) {
      try {
        await userApi.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Lỗi khi xóa người dùng');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'All' || user.vai_tro === roleFilter;
    return matchSearch && matchRole;
  });

  // Calculate total spent for each user
  const getUserTotalSpent = (userId) => {
    // This would require loading orders separately if needed
    // For now, we'll calculate from the user's orders if loaded
    return users.find(u => u.id === userId)?.orders?.reduce((sum, order) => sum + (order.tong_tien || 0), 0) || 0;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-indigo-600" /> Quản lý người dùng
        </h1>
        <p className="text-sm text-slate-500">Xem danh sách người dùng, khách hàng và quản lý quyền truy cập.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-xs text-emerald-600 font-bold uppercase">Khách hàng</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{stats?.total_customers || '...'}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-xs text-purple-600 font-bold uppercase">Quản trị viên</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{stats?.total_admins || '...'}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-xs text-amber-600 font-bold uppercase">Có đơn hàng</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{stats?.users_with_orders || '...'}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc email..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="border border-slate-200 rounded-xl px-4 py-2 outline-none bg-white font-medium text-slate-600"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">Tất cả vai trò</option>
          <option value="nguoi_dung">Khách hàng</option>
          <option value="quan_tri">Quản trị viên</option>
        </select>
      </div>

      {/* User List Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <Loader size={40} className="text-indigo-500 animate-spin" />
            <p className="text-slate-400 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <AlertCircle size={40} className="text-rose-500" />
            <p className="text-slate-600 font-medium">{error}</p>
          </div>
        ) : (
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4 text-left">Tên người dùng</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Điện thoại</th>
              <th className="px-6 py-4 text-center">Vai trò</th>
              <th className="px-6 py-4 text-center">Ngày tạo</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200 shadow-sm">
                      {user.ten.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{user.ten}</p>
                      <p className="text-xs text-slate-400">ID: #{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{user.so_dien_thoai || 'N/A'}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${
                    user.vai_tro === 'quan_tri' 
                    ? 'bg-purple-50 text-purple-600 border-purple-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {user.vai_tro === 'quan_tri' ? 'Admin' : 'Khách hàng'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="text-sm text-slate-500">{user.ngay_tao ? new Date(user.ngay_tao).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-all"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {!loading && filteredUsers.length === 0 && !error && (
        <div className="py-20 text-center flex flex-col items-center gap-2">
          <AlertCircle size={40} className="text-slate-300" />
          <p className="text-slate-400 font-medium">Không tìm thấy người dùng nào.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerList;