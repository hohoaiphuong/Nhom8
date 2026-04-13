import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['Tiểu thuyết', 'Khoa học', 'Lịch sử', 'Tâm lý', 'Kỹ năng', 'Tham khảo'];

  useEffect(() => {
    // Mock data with real book cover images
    const bookCovers = [
      { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', isbn: '9780671808914', category: 'Kỹ năng' },
      { title: 'Nhà Giả Kim', author: 'Paulo Coelho', isbn: '9780062412584', category: 'Tiểu thuyết' },
      { title: 'Lược Sử Thời Gian', author: 'Stephen Hawking', isbn: '9780553896718', category: 'Khoa học' },
      { title: 'Tâm Lý Học Nhân Dân', author: 'Albert Ellis', isbn: '9780879755171', category: 'Tâm lý' },
      { title: 'Hành Trình Khám Phá', author: 'Charles Darwin', isbn: '9780141199993', category: 'Lịch sử' },
      { title: 'Suy Nghĩ, Làm Giàu', author: 'Napoleon Hill', isbn: '9781585424337', category: 'Tham khảo' },
      { title: '1984', author: 'George Orwell', isbn: '9780135288238', category: 'Tiểu thuyết' },
      { title: 'Công Nghệ Và Tương Lai', author: 'Ray Kurzweil', isbn: '9780670033843', category: 'Khoa học' },
      { title: 'Bố Già', author: 'Mario Puzo', isbn: '9780451205766', category: 'Tiểu thuyết' },
      { title: 'Tự Do Tài Chính', author: 'Robert Kiyosaki', isbn: '9780446677455', category: 'Tham khảo' },
      { title: 'Người Thầy Vĩ Đại', author: 'Robin Sharma', isbn: '9781609940010', category: 'Kỹ năng' },
      { title: 'Khoa Học Hạnh Phúc', author: 'Martin Seligman', isbn: '9781439190739', category: 'Tâm lý' },
      { title: 'Jane Eyre', author: 'Charlotte Brontë', isbn: '9780141199825', category: 'Tiểu thuyết' },
      { title: 'Cuộc Sống Thật Đơn Giản', author: 'Thich Nhat Hanh', isbn: '9781888375404', category: 'Lịch sử' },
      { title: 'Lập Trình Python', author: 'Guido van Rossum', isbn: '9781449355739', category: 'Khoa học' },
      { title: 'Kinh Tế Vi Mô', author: 'Paul Krugman', isbn: '9780131882522', category: 'Tham khảo' },
      { title: 'Trí Tuệ Cảm Xúc', author: 'Daniel Goleman', isbn: '9780553090710', category: 'Tâm lý' },
      { title: 'Thế Giới Phẳng', author: 'Thomas Friedman', isbn: '9780374292935', category: 'Lịch sử' },
      { title: 'Tư Duy Nhanh', author: 'Daniel Kahneman', isbn: '9780374533557', category: 'Tâm lý' },
      { title: 'Sư Tử', author: 'Leo Tolstoy', isbn: '9780199232765', category: 'Tiểu thuyết' },
      { title: 'Thực Hành Thiền', author: 'Jon Kabat-Zinn', isbn: '9780553340679', category: 'Kỹ năng' },
      { title: 'Lịch Sử Loài Người', author: 'Yuval Harari', isbn: '9780062316097', category: 'Lịch sử' },
      { title: 'Tương Lai Của Cơ Thể', author: 'Juan Enriquez', isbn: '9781101566762', category: 'Khoa học' },
      { title: 'Đầu Tư Thông Minh', author: 'Benjamin Graham', isbn: '9780060555665', category: 'Tham khảo' },
    ];

    const mockProducts = bookCovers.map((book, i) => ({
      id: i + 1,
      title: book.title,
      author: book.author,
      price: Math.floor(Math.random() * 150000) + 50000,
      originalPrice: Math.floor(Math.random() * 200000) + 100000,
      discount: Math.floor(Math.random() * 25) + 5,
      category: book.category,
      image: `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`,
      reviews: Math.floor(Math.random() * 250) + 20,
    }));

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Cửa hàng</h1>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Danh mục</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="w-4 h-4"
                    />
                    <span>Tất cả</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Giá</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Từ"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Đến"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-bold text-lg mb-4">Sắp xếp</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá từ thấp đến cao</option>
                  <option value="price-high">Giá từ cao đến thấp</option>
                  <option value="popular">Phổ biến nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toggle Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-lg shadow-md"
            >
              <Filter size={20} />
              Bộ lọc
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
