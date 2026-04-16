import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm">
          <span>Miễn phí vận chuyển từ 250K</span>
          <span>Hotline: 1900.xxxx.xxxx</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-pink-600">📚 STU</div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 mx-8 bg-gray-100 rounded-full px-4 py-2"
          >
            <input
              type="text"
              placeholder="Tìm sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button type="submit" className="text-gray-600 hover:text-pink-600">
              <Search size={20} />
            </button>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link to="/account" className="hidden md:block text-gray-600 hover:text-pink-600">
              <User size={24} />
            </Link>
            <Link to="/wishlist" className="hidden md:block text-gray-600 hover:text-pink-600">
              <Heart size={24} />
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-pink-600">
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form
          onSubmit={handleSearch}
          className="md:hidden flex bg-gray-100 rounded-full px-4 py-2 mb-4"
        >
          <input
            type="text"
            placeholder="Tìm sách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button type="submit" className="text-gray-600">
            <Search size={20} />
          </button>
        </form>

        {/* Navigation */}
        <nav className={`${isOpen ? 'block' : 'hidden'} md:flex gap-6 border-t pt-4 md:border-t-0 md:pt-0`}>
          <Link to="/" className="text-gray-700 hover:text-pink-600 font-medium">
            Trang chủ
          </Link>
          <Link to="/shop" className="text-gray-700 hover:text-pink-600 font-medium">
            Cửa hàng
          </Link>
          <Link to="/sale" className="text-gray-700 hover:text-pink-600 font-medium">
            Sale
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-pink-600 font-medium">
            Về chúng tôi
          </Link>
        </nav>
      </div>
    </header>
  );
}
