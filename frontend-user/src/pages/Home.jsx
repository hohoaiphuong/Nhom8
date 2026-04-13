import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data with real book cover images from Open Library
    const mockBooks = [
      {
        id: 1,
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        price: 89000,
        originalPrice: 120000,
        discount: 25,
        category: 'Phát triển bản thân',
        image: 'https://covers.openlibrary.org/b/isbn/9780671808914-M.jpg',
        reviews: 120,
      },
      {
        id: 2,
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        price: 65000,
        originalPrice: 85000,
        discount: 23,
        category: 'Tiểu thuyết',
        image: 'https://covers.openlibrary.org/b/isbn/9780062412584-M.jpg',
        reviews: 89,
      },
      {
        id: 3,
        title: 'Lược Sử Thời Gian',
        author: 'Stephen Hawking',
        price: 75000,
        category: 'Khoa học',
        image: 'https://covers.openlibrary.org/b/isbn/9780553896718-M.jpg',
        reviews: 156,
      },
      {
        id: 4,
        title: 'Tâm Lý Học Nhân Dân',
        author: 'Albert Ellis',
        price: 95000,
        discount: 15,
        category: 'Tâm lý',
        image: 'https://covers.openlibrary.org/b/isbn/9780879755171-M.jpg',
        reviews: 203,
      },
      {
        id: 5,
        title: 'Hành Trình Khám Phá',
        author: 'Charles Darwin',
        price: 110000,
        category: 'Lịch sử',
        image: 'https://covers.openlibrary.org/b/isbn/9780141199993-M.jpg',
        reviews: 87,
      },
      {
        id: 6,
        title: 'Suy Nghĩ, Làm Giàu',
        author: 'Napoleon Hill',
        price: 85000,
        discount: 10,
        category: 'Kinh tế',
        image: 'https://covers.openlibrary.org/b/isbn/9781585424337-M.jpg',
        reviews: 145,
      },
      {
        id: 7,
        title: '1984',
        author: 'George Orwell',
        price: 72000,
        category: 'Tiểu thuyết',
        image: 'https://covers.openlibrary.org/b/isbn/9780135288238-M.jpg',
        reviews: 298,
      },
      {
        id: 8,
        title: 'Công Nghệ Và Tương Lai',
        author: 'Ray Kurzweil',
        price: 98000,
        discount: 20,
        category: 'Khoa học',
        image: 'https://covers.openlibrary.org/b/isbn/9780670033843-M.jpg',
        reviews: 176,
      },
    ];

    setFeaturedBooks(mockBooks);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <Banner />

      {/* Featured Books */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            📚 Sách hay hàng tuần
          </h2>
          <Link to="/shop" className="text-pink-600 hover:text-pink-700 font-semibold">
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <ProductCard key={book.id} product={book} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Danh mục sách
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Tiểu thuyết', 'Khoa học', 'Lịch sử', 'Tâm lý', 'Kỹ năng'].map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${cat}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all text-center font-semibold text-gray-700 hover:text-pink-600"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Miễn phí vận chuyển</h3>
            <p>Cho đơn hàng từ 250.000đ trở lên</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Hoàn tiền 100%</h3>
            <p>Nếu không hài lòng trong 30 ngày</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Hỗ trợ 24/7</h3>
            <p>Đội ngũ chăm sóc khách hàng luôn sẵn sàng</p>
          </div>
        </div>
      </section>
    </div>
  );
}
