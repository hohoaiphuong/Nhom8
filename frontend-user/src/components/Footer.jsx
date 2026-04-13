import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">📚 STU Book</h3>
            <p className="text-sm mb-4">
              Cửa hàng bán sách online hàng đầu Việt Nam, cung cấp hàng ngàn đầu sách từ các nhà xuất bản uy tín.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-pink-500 text-xl"><FaFacebook /></a>
              <a href="#" className="hover:text-pink-500 text-xl"><FaInstagram /></a>
              <a href="#" className="hover:text-pink-500 text-xl"><FaTwitter /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-pink-500">Trang chủ</Link></li>
              <li><Link to="/shop" className="hover:text-pink-500">Cửa hàng</Link></li>
              <li><Link to="/about" className="hover:text-pink-500">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="hover:text-pink-500">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold mb-4">Chăm sóc khách hàng</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-pink-500">Chính sách vận chuyển</Link></li>
              <li><Link to="#" className="hover:text-pink-500">Chính sách hoàn trả</Link></li>
              <li><Link to="#" className="hover:text-pink-500">Câu hỏi thường gặp</Link></li>
              <li><Link to="#" className="hover:text-pink-500">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Liên hệ chúng tôi</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <Phone size={18} className="text-pink-500" />
                <span>1900.xxxx.xxxx</span>
              </li>
              <li className="flex gap-2">
                <Mail size={18} className="text-pink-500" />
                <span>support@stubook.vn</span>
              </li>
              <li className="flex gap-2">
                <MapPin size={18} className="text-pink-500" />
                <span>123 Đường ABC, Hà Nội</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2024 STU Book. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
