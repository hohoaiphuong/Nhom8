import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { cartApi } from '../../api/cartApi';

const CartDetailModal = ({ isOpen, onClose, cart, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !cart) return null;

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Xóa sản phẩm này khỏi giỏ?')) {
      try {
        setUpdating(true);
        await cartApi.removeFromCart(cart.id, itemId);
        onUpdate();
      } catch (err) {
        console.error('Error removing item:', err);
        alert('Lỗi khi xóa sản phẩm');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      setUpdating(true);
      await cartApi.updateQuantity(cart.id, itemId, newQuantity);
      onUpdate();
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Lỗi khi cập nhật số lượng');
    } finally {
      setUpdating(false);
    }
  };

  const items = cart.chi_tiet_gio_hang || [];
  const totalItems = items.reduce((sum, item) => sum + (item.so_luong || 0), 0);
  const totalPrice = items.reduce((sum, item) => sum + ((item.sach?.gia || 0) * (item.so_luong || 0)), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 p-6 border-b bg-white flex justify-between items-center z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Giỏ hàng của {cart.user?.ten}</h2>
            <p className="text-xs text-slate-500 mt-1">{cart.user?.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 font-medium">Giỏ hàng trống</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors group"
              >
                {/* Book Image */}
                <div className="w-20 h-24 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {item.sach?.hinh_anh ? (
                    <img
                      src={item.sach.hinh_anh}
                      alt={item.sach?.ten_sach}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 text-center px-2">Không có ảnh</span>
                  )}
                </div>

                {/* Book Info */}
                <div className="flex-1 space-y-2">
                  <h4 className="font-bold text-slate-800">{item.sach?.ten_sach}</h4>
                  <p className="text-xs text-slate-500">{item.sach?.tac_gia}</p>
                  <p className="text-sm font-bold text-blue-600">
                    {(item.sach?.gia || 0).toLocaleString()}đ
                  </p>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.so_luong - 1)}
                    disabled={updating}
                    className="p-1 text-slate-600 hover:bg-white rounded transition-colors disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-800">
                    {item.so_luong}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.so_luong + 1)}
                    disabled={updating}
                    className="p-1 text-slate-600 hover:bg-white rounded transition-colors disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right flex flex-col justify-between">
                  <p className="font-bold text-slate-800">
                    {((item.sach?.gia || 0) * (item.so_luong || 0)).toLocaleString()}đ
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={updating}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="sticky bottom-0 bg-slate-50 border-t p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-slate-800">{totalItems}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Giá trị</p>
                <p className="text-2xl font-bold text-blue-600">{(totalPrice / 1000000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Bình quân</p>
                <p className="text-2xl font-bold text-slate-800">
                  {totalItems > 0 ? (totalPrice / totalItems / 1000).toFixed(0) : 0}K
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-white transition-all"
              >
                Đóng
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                Chuyển thành đơn hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDetailModal;
