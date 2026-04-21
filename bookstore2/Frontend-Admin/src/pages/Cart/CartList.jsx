import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Trash2, Eye, AlertCircle, Loader } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { cartApi } from '../../api/cartApi';
import CartDetailModal from './CartDetailModal';

const CartList = () => {
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCart, setSelectedCart] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCarts: 0,
    totalItems: 0,
    totalValue: 0,
    activeUsers: 0
  });

  // Fetch users and their carts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all users
        const usersResponse = await userApi.getUsers();
        const usersData = usersResponse.data.data || [];
        setUsers(usersData);

        // Fetch all carts from admin endpoint
        const cartsResponse = await cartApi.getAllCarts();
        const cartsData = cartsResponse.data.data || [];
        
        setCarts(cartsData);
        setFilteredUsers(usersData);

        // Calculate statistics
        const activeUsersWithCarts = cartsData.filter(c => c.totalItems > 0).length;
        const totalItems = cartsData.reduce((sum, c) => sum + (c.totalItems || 0), 0);
        const totalValue = cartsData.reduce((sum, c) => sum + (c.totalValue || 0), 0);

        setStats({
          totalCarts: cartsData.length,
          totalItems,
          totalValue,
          activeUsers: activeUsersWithCarts
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching cart data:', err);
        setError('Không thể tải dữ liệu giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search and filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Get cart for selected user
  const getUserCart = (userId) => {
    return carts.find(c => c.nguoi_dung_id === userId);
  };

  const handleViewCart = (userId) => {
    const cart = getUserCart(userId);
    if (cart) {
      setSelectedCart(cart);
      setIsModalOpen(true);
    }
  };

  const handleClearCart = async (cartId) => {
    if (window.confirm('Xóa toàn bộ giỏ hàng này?')) {
      try {
        await cartApi.clearCartAdmin(cartId);
        setCarts(carts.map(c => c.id === cartId ? { ...c, chi_tiet_gio_hang: [], totalItems: 0, totalValue: 0 } : c));
        alert('Xóa giỏ hàng thành công');
      } catch (err) {
        console.error('Error clearing cart:', err);
        alert('Lỗi khi xóa giỏ hàng');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingCart className="text-blue-600" /> Quản lý giỏ hàng
        </h1>
        <p className="text-slate-500 text-sm">Theo dõi và quản lý giỏ hàng của khách hàng.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-xs text-blue-600 font-bold uppercase">Tổng giỏ hàng</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalCarts}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-xs text-emerald-600 font-bold uppercase">Giỏ có hàng</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{stats.activeUsers}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-xs text-amber-600 font-bold uppercase">Tổng sản phẩm</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{stats.totalItems}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-xs text-purple-600 font-bold uppercase">Giá trị giỏ</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{(stats.totalValue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm khách hàng..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <Loader size={40} className="text-blue-500 animate-spin" />
            <p className="text-slate-400 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <AlertCircle size={40} className="text-rose-500" />
            <p className="text-slate-600 font-medium">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <AlertCircle size={40} className="text-slate-300" />
            <p className="text-slate-400 font-medium">Không tìm thấy khách hàng nào.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4 text-left">Khách hàng</th>
                <th className="px-6 py-4 text-center">Sản phẩm</th>
                <th className="px-6 py-4 text-center">Giá trị</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const cart = getUserCart(user.id);
                const hasItems = cart && cart.totalItems > 0;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{user.ten}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-bold rounded-full">
                        {cart?.totalItems || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="font-bold text-slate-800">
                        {cart ? (cart.totalValue / 1000000).toFixed(1) : 0}M
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {hasItems ? (
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase rounded-full border border-emerald-200">
                          🛒 Có hàng
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 bg-slate-50 text-slate-500 text-[11px] font-bold uppercase rounded-full border border-slate-200">
                          Trống
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {hasItems && (
                          <>
                            <button
                              onClick={() => handleViewCart(user.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleClearCart(cart.id)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <CartDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cart={selectedCart}
        onUpdate={() => {
          // Refresh cart data
          if (selectedCart) {
            const updatedCart = carts.find(c => c.id === selectedCart.id);
            if (updatedCart) {
              setSelectedCart(updatedCart);
            }
          }
        }}
      />
    </div>
  );
};

export default CartList;
