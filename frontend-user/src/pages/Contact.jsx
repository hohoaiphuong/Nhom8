import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Liên hệ chúng tôi</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Contact Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <Phone size={48} className="mx-auto text-pink-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Gọi cho chúng tôi</h3>
            <p className="text-gray-600 mb-4">Chúng tôi sẵn sàng hỗ trợ bạn 24/7</p>
            <a href="tel:1900xxxx" className="text-pink-600 hover:text-pink-700 font-bold">
              1900.xxxx.xxxx
            </a>
          </div>

          {/* Contact Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <Mail size={48} className="mx-auto text-pink-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Gửi email cho chúng tôi bất cứ lúc nào</p>
            <a href="mailto:support@stubook.vn" className="text-pink-600 hover:text-pink-700 font-bold">
              support@stubook.vn
            </a>
          </div>

          {/* Contact Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <MapPin size={48} className="mx-auto text-pink-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Địa chỉ</h3>
            <p className="text-gray-600">123 Đường ABC<br />Hà Nội, Việt Nam</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Họ tên *</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nhập họ tên"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Email *</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Tiêu đề *</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Tiêu đề tin nhắn"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Tin nhắn *</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none h-32"
                placeholder="Nội dung tin nhắn"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
