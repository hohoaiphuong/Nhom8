import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image */}
      <Link to={`/book/${product.id}`} className="relative block overflow-hidden bg-gray-200">
        <img
          src={product.image || 'https://via.placeholder.com/300x400'}
          alt={product.title}
          className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        )}

        {/* Title */}
        <Link
          to={`/book/${product.id}`}
          className="block text-sm font-semibold text-gray-800 mb-2 hover:text-pink-600 line-clamp-2"
        >
          {product.title}
        </Link>

        {/* Author */}
        {product.author && (
          <p className="text-xs text-gray-600 mb-2">Tác giả: {product.author}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-pink-600">
            {product.price?.toLocaleString('vi-VN')}đ
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice?.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            <span className="text-sm">Thêm</span>
          </button>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isWishlisted
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
