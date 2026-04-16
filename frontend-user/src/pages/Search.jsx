import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Mock search results
  const mockResults = [
    {
      id: 1,
      title: 'Sách hay về tìm kiếm',
      author: 'Tác giả A',
      price: 89000,
      discount: 10,
      category: 'Sách hay',
      image: 'https://via.placeholder.com/300x400?text=Book+Search',
      reviews: 45,
    },
    {
      id: 2,
      title: 'Khoa học tìm hiểu',
      author: 'Tác giả B',
      price: 75000,
      category: 'Khoa học',
      image: 'https://via.placeholder.com/300x400?text=Book+Search2',
      reviews: 32,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Tìm kiếm sách</h1>
        <p className="text-gray-600 mb-8">
          Kết quả tìm kiếm cho: <span className="font-bold text-pink-600">"{query}"</span>
        </p>

        {mockResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockResults.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy kết quả</h2>
            <p className="text-gray-600 mb-6">
              Không có sách nào phù hợp với tìm kiếm "{query}"
            </p>
            <a href="/shop" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Xem tất cả sách
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
