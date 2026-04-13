import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Share2, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Mock data - Replace with API call
    const mockProduct = {
      id: id,
      title: 'Những quyển sách hay nhất',
      author: 'Tác giả nổi tiếng',
      publisher: 'Nhà xuất bản ABC',
      publishYear: 2023,
      price: 89000,
      originalPrice: 120000,
      discount: 25,
      category: 'Sách hay',
      image: 'https://via.placeholder.com/500x600?text=Book',
      rating: 4.5,
      reviews: 120,
      stock: 50,
      description: `Đây là một cuốn sách tuyệt vời với nội dung hấp dẫn và bổ ích. 
      Tác giả đã viết nên những câu chuyện thú vị, truyền cảm hứng cho bạn đọc.
      Sách này phù hợp cho mọi độ tuổi và là lựa chọn hoàn hảo cho người yêu thích đọc.`,
      details: {
        pages: 320,
        language: 'Tiếng Việt',
        format: 'Bìa cứng',
        weight: '500g',
        dimensions: '20 x 15 cm',
      }
    };

    setProduct(mockProduct);
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (quantity > 0 && product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
      toast.success(`Đã thêm ${quantity} cuốn vào giỏ hàng!`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
    </div>;
  }

  if (!product) {
    return <div className="text-center py-12"><p>Không tìm thấy sách</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-8">
          <span>Trang chủ / {product.category} / {product.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-md p-8">
          {/* Left - Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-96 object-cover"
            />
          </div>

          {/* Right - Product Info */}
          <div>
            {/* Title & Category */}
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>

            {/* Author & Details */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-gray-600 mb-2">Tác giả: <span className="font-semibold">{product.author}</span></p>
              <p className="text-gray-600 mb-2">Nhà xuất bản: <span className="font-semibold">{product.publisher}</span></p>
              <p className="text-gray-600">Năm xuất bản: <span className="font-semibold">{product.publishYear}</span></p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{product.rating}</span>
              <span className="text-gray-600">({product.reviews} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-pink-600">{product.price.toLocaleString('vi-VN')}đ</span>
                <span className="text-xl text-gray-400 line-through">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Giảm {product.discount}%
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

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Thêm vào giỏ hàng
              </button>

              {/* Wishlist & Share */}
              <div className="flex gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? 'bg-red-50 border-red-600 text-red-600'
                      : 'border-gray-300 text-gray-600 hover:border-red-600'
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  Yêu thích
                </button>
                <button className="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-600 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-2">
                  <Share2 size={20} />
                  Chia sẻ
                </button>
              </div>
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

        {/* Description & Details Tabs */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <div className="tabs">
            <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

            <h3 className="text-xl font-bold mb-4">Chi tiết sản phẩm</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <p className="text-gray-600 text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                  <p className="font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
