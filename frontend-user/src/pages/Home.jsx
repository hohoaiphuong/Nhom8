import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import { bookAPI } from '../api/bookAPI';
import axios from 'axios';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://nhom8-backend-laravel.onrender.com/api'}/categories`);
        setCategories(res.data.data || res.data);
      } catch (err) {
        console.error('Không thể lấy danh mục:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let mounted = true;
    const isInitial = { current: true };
    const fetchBooks = async () => {
      try {
        if (isInitial.current) setLoading(true);
        const res = await bookAPI.getBooks(1, 8);
        if (!mounted) return;
        
        // 👇 ĐÃ SỬA LỖI ẢNH: Nhận diện Link bất tử 👇
        const homeItems = res.data.slice(0, 8).map(b => ({
          id: b.id,
          title: b.title,
          author: b.author || '',
          price: b.price || 0,
          originalPrice: b.price || 0,
          discount: 0,
          category: b.category_id || 'Khác',
          image: b.image 
            ? (b.image.startsWith('http') 
                ? b.image 
                : `https://nhom8-backend-laravel.onrender.com/storage/${b.image}`) 
            : 'https://placehold.co/300x400/eeeeee/999999?text=Chua+Co+Anh',
          reviews: Math.floor(Math.random() * 200) + 5,
        }));
        // 👆 KẾT THÚC ĐOẠN SỬA 👆
        
        setFeaturedBooks(homeItems);
        isInitial.current = false;
      } catch (err) {
        console.error('Không thể lấy sách:', err);
      } finally {
        if (mounted && isInitial.current === false) {
          setLoading(false);
        } else if (mounted && isInitial.current) {
          setLoading(false);
        }
      }
    };

    fetchBooks();
    const interval = setInterval(fetchBooks, 10000); 
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <div className="min-h-screen">
      <Banner />
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">📚 Sách hay hàng tuần</h2>
          <Link to="/shop" className="text-pink-600 hover:text-pink-700 font-semibold">Xem tất cả →</Link>
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

      <section className="bg-gray-100 py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Danh mục sách</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all text-center font-semibold text-gray-700 hover:text-pink-600 flex items-center justify-center min-h-[100px]">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

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