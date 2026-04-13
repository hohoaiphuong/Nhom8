import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Package, Heart, MapPin } from 'lucide-react';
export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const mockUser = {
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    phone: '0123456789',
    address: '123 Đường ABC, Hà Nội',
  };

  const mockOrders = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      total: 250000,
      status: 'Đã giao',
      items: 2,
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      total: 350000,
      status: 'Đang giao',
      items: 3,
    },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Tài khoản của bạn</h1>

            <div className="flex gap-4">
              <button
                onClick={() => setIsLoggedIn(true)}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Đăng nhập
              </button>
              <button className="flex-1 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 font-bold py-3 rounded-lg transition-colors">
                Đăng ký
              </button>
            </div>

            <div className="mt-8 text-center text-gray-600">
              <p>Đăng nhập để xem lịch sử mua hàng, yêu thích và thông tin tài khoản</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
            <div className="mb-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="font-bold text-lg">{mockUser.name}</h3>
              <p className="text-sm text-gray-600">{mockUser.email}</p>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Thông tin tài khoản', icon: '👤' },
                { id: 'orders', label: 'Đơn hàng của tôi', icon: '📦' },
                { id: 'wishlist', label: 'Danh sách yêu thích', icon: '❤️' },
                { id: 'addresses', label: 'Địa chỉ giao hàng', icon: '📍' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-pink-100 text-pink-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full mt-6 border-2 border-red-500 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Thông tin tài khoản</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên</label>
                    <input
                      type="text"
                      value={mockUser.name}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={mockUser.email}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      value={mockUser.phone}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      readOnly
                    />
                  </div>
                  <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold">Đơn hàng của tôi</h2>
                </div>
                <div className="divide-y">
                  {mockOrders.map(order => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{order.id}</h3>
                          <p className="text-sm text-gray-600">Ngày: {order.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'Đã giao'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-600">{order.items} sản phẩm</span>
                        <span className="font-bold text-lg text-pink-600">
                          {order.total.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center py-12">
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Danh sách yêu thích của bạn trống</p>
                <Link to="/shop" className="text-pink-600 hover:text-pink-700 font-semibold mt-2 inline-block">
                  Tiếp tục mua sắm →
                </Link>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-colors">
                  + Thêm địa chỉ mới
                </button>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">Địa chỉ nhà</h3>
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded text-sm font-semibold">Mặc định</span>
                  </div>
                  <p className="text-gray-700 mb-2">{mockUser.address}</p>
                  <p className="text-gray-600 mb-4">{mockUser.phone}</p>
                  <div className="flex gap-2">
                    <button className="text-pink-600 hover:text-pink-700 font-semibold">Chỉnh sửa</button>
                    <span className="text-gray-400">|</span>
                    <button className="text-red-600 hover:text-red-700 font-semibold">Xóa</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
