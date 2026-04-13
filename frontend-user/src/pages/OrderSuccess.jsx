import { Link } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle size={64} className="mx-auto text-green-500" strokeWidth={1.5} />
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đơn hàng thành công!</h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý trong thời gian sớm nhất.
        </p>

        {/* Order Details */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Mã đơn hàng:</span>
            <span className="font-bold text-pink-600">#ORD20240115001</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Thời gian tạo:</span>
            <span className="font-semibold">{new Date().toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tổng thanh toán:</span>
            <span className="font-bold text-lg text-pink-600">250.000đ</span>
          </div>
        </div>

        {/* Info Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
          <p className="text-blue-800">
            ✓ Bạn sẽ nhận được email xác nhận ở địa chỉ email của mình
            <br />✓ Chúng tôi sẽ giao hàng trong 2-3 ngày làm việc
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            to="/account"
            className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            <Download size={20} />
            Xem đơn hàng của tôi
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 font-bold py-3 rounded-lg transition-colors"
          >
            <Home size={20} />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
