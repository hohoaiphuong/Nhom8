import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';
import { bookAPI } from '../api/bookAPI';
import axios from 'axios';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('newest');
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
        const res = await bookAPI.getBooks(1, 24);
        if (!mounted) return;
        
        // 👇 ĐÃ SỬA LỖI ẢNH: Nhận diện Link bất tử 👇
        const items = res.data.map(b => ({
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
        
        setProducts(items);
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

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category.toString() !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'popular': return b.reviews - a.reviews;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Cửa hàng</h1>

        <div className="flex gap-6">
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Danh mục</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={selectedCategory === 'all'} onChange={() => setSelectedCategory('all')} className="w-4 h-4 text-pink-600 focus:ring-pink-500" />
                    <span>Tất cả</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={selectedCategory === cat.id.toString()} onChange={() => setSelectedCategory(cat.id.toString())} className="w-4 h-4 text-pink-600 focus:ring-pink-500" />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Giá</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="number" min="0" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm" placeholder="Từ" />
                    <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])} className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm" placeholder="Đến" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Sắp xếp</h3>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:ring-pink-500 focus:border-pink-500">
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá từ thấp đến cao</option>
                  <option value="price-high">Giá từ cao đến thấp</option>
                  <option value="popular">Phổ biến nhất</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-lg shadow-md">
              <Filter size={20} /> Bộ lọc
            </button>

            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">Không tìm thấy sách nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}