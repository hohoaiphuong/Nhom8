import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link to="/shop" className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-8">
            <ArrowLeft size={20} />
            Tiếp tục mua sắm
          </Link>

          <div className="bg-white rounded-lg shadow-md text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
            <Link
              to="/shop"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Bắt đầu mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-5 gap-4 bg-gray-100 p-4 font-semibold text-gray-700 border-b">
                <div className="col-span-2">Sản phẩm</div>
                <div className="text-center">Giá</div>
                <div className="text-center">Số lượng</div>
                <div className="text-right">Thao tác</div>
              </div>

              {/* Items */}
              {cart.map((item) => (
                <div key={item.id} className="border-b p-4 md:grid md:grid-cols-5 md:gap-4 md:items-center">
                  {/* Product */}
                  <div className="col-span-2 flex gap-4 mb-4 md:mb-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">ID: {item.id}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4 md:mb-0">
                    <span className="font-semibold text-pink-600">
                      {item.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-center gap-2 mb-4 md:mb-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="text-right">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 justify-end"
                    >
                      <Trash2 size={18} />
                      <span className="text-sm">Xóa</span>
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="md:hidden mt-2 text-right font-semibold">
                    Tổng: {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mt-4 font-semibold"
            >
              <ArrowLeft size={20} />
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h2>

              {/* Summary Items */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng giá trị sản phẩm:</span>
                  <span>{getTotalPrice().toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Giảm giá:</span>
                  <span>0đ</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-3xl font-bold text-pink-600">
                    {getTotalPrice().toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-colors text-center mb-2"
              >
                Tiến hành thanh toán
              </Link>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full border border-red-500 text-red-600 hover:bg-red-50 font-semibold py-2 rounded-lg transition-colors"
              >
                Xóa giỏ hàng
              </button>

              {/* Trust Badges */}
              <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
                <p>✓ Thanh toán an toàn</p>
                <p>✓ Giao hàng nhanh</p>
                <p>✓ Hỗ trợ 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
