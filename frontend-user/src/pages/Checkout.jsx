import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    paymentMethod: 'cod',
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
          <p className="text-gray-600 mb-8">Bạn cần thêm sản phẩm vào giỏ hàng để thanh toán</p>
          <Link
            to="/shop"
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success('Đơn hàng đã được tạo thành công!');
      clearCart();
      setLoading(false);
      navigate('/order-success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/cart" className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-8">
          <ArrowLeft size={20} />
          Quay lại giỏ hàng
        </Link>

        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Thông tin giao hàng</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Họ tên *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Số điện thoại *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="0xxxxxxxxx"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Địa chỉ *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Số nhà, tên đường..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Thành phố</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="TP. Hà Nội"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Quận/Huyện</label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Quận Cầu Giấy"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold mb-4">Phương thức thanh toán</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-pink-500">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <div>
                        <span className="font-semibold">Thanh toán khi nhận hàng (COD)</span>
                        <p className="text-sm text-gray-600">Bạn sẽ trả tiền khi nhận hàng</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-pink-500">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === 'bank'}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <div>
                        <span className="font-semibold">Chuyển khoản ngân hàng</span>
                        <p className="text-sm text-gray-600">Chuyển tiền trước, chúng tôi sẽ gửi hàng</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    {loading ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 pb-4 border-b max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.title} <span className="font-semibold">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng giá trị:</span>
                  <span>{getTotalPrice().toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>

              {/* Final Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Tổng cộng:</span>
                <span className="text-2xl font-bold text-pink-600">
                  {getTotalPrice().toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
