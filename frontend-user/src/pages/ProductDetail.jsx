import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Share2, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios'; // Đã thêm axios

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Link API lấy từ .env hoặc dùng trực tiếp link Render của nhóm
  const API_URL = import.meta.env.VITE_API_URL || 'https://nhom8-backend-laravel.onrender.com/api';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Gọi API lấy chi tiết sách theo ID
        const response = await axios.get(`${API_URL}/books/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Lỗi Backend:', error);
        toast.error('Không thể tải thông tin sách!');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, API_URL]);

  const handleAddToCart = () => {
    if (quantity > 0 && product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: getImageUrl(product.image),
        quantity: quantity,
      });
      toast.success(`Đã thêm ${quantity} cuốn vào giỏ hàng!`);
    }
  };

  // Hàm xử lý ảnh: Nếu là link mạng thì giữ nguyên, nếu là file thì cộng thêm link server
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/500x600?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://nhom8-backend-laravel.onrender.com/storage/${imagePath}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
    </div>;
  }

  if (!product) {
    return <div className="text-center py-12"><p>Không tìm thấy sách hoặc lỗi máy chủ.</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-8">
          <span>Trang chủ / {product.category_name || 'Sách'} / {product.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-md p-8">
          {/* Left - Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
            <img
              src={getImageUrl(product.image)}
              alt={product.title}
              className="max-w-full max-h-96 object-contain"
            />
          </div>

          {/* Right - Product Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2">{product.category_name || 'Sách hay'}</p>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>

            {/* Author & Details */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-gray-600 mb-2">Tác giả: <span className="font-semibold">{product.author || 'Đang cập nhật'}</span></p>
              <p className="text-gray-600 mb-2">Nhà xuất bản: <span className="font-semibold">{product.publisher || 'NXB Trẻ'}</span></p>
              <p className="text-gray-600">Năm xuất bản: <span className="font-semibold">{product.publishYear || '2024'}</span></p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">4.0</span>
              <span className="text-gray-600">(Mặc định)</span>
            </div>

            {/* Price */}
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-pink-600">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">{Number(product.originalPrice).toLocaleString('vi-VN')}đ</span>
                )}
              </div>
              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Giảm {product.discount || 0}%
              </span>
            </div>

            {/* Stock Info */}
            <p className={`mb-6 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `Còn ${product.stock} cuốn` : 'Hết hàng'}
            </p>

            {/* Quantity & Actions */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-blue-900">ℹ️ Thông tin thêm</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Miễn phí vận chuyển từ 250.000đ</li>
                <li>✓ Đổi trả miễn phí trong 30 ngày</li>
                <li>✓ Được bọc trong bao bì đẹp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description || 'Chưa có mô tả cụ thể cho cuốn sách này.'}
          </p>
        </div>
      </div>
    </div>
  );
}