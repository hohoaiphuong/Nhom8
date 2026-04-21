import { X, Printer, Loader, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { orderApi } from '../../api/orderApi';
import { formatCurrency } from '../../utils/formatCurrency';

const OrderDetailModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  // Fetch order details when modal opens
  useEffect(() => {
    if (isOpen && order) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const response = await orderApi.getOrder(order.id);
          // Backend trả về response.data là object trực tiếp (không wrap trong data field)
          const orderData = response.data;
          console.log('📋 Order details API response:', orderData);
          console.log('📋 OrderDetails field:', orderData.orderDetails);
          console.log('📋 chi_tiet_don_hang field:', orderData.chi_tiet_don_hang);
          console.log('📋 Full orderData:', JSON.stringify(orderData, null, 2));
          setOrderDetails(orderData);
          setNewStatus(orderData.trang_thai);
        } catch (error) {
          console.error('❌ Error fetching order details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [isOpen, order]);

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === orderDetails?.trang_thai) return;
    
    try {
      setUpdating(true);
      await orderApi.updateOrderStatus(orderDetails.id, newStatus);
      setOrderDetails(prev => ({ ...prev, trang_thai: newStatus }));
      if (onStatusUpdate) {
        onStatusUpdate(orderDetails.id, newStatus);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Lỗi khi cập nhật trạng thái đơn hàng');
      setNewStatus(orderDetails?.trang_thai);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen || !order) return null;

  const currentOrder = orderDetails || order;
  const items = currentOrder.orderDetails || currentOrder.order_details || currentOrder.chi_tiet_don_hang || [];
  const totalItems = items.reduce((sum, item) => sum + item.so_luong, 0);
  const finalTotal = currentOrder.tong_tien || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Chi tiết đơn hàng #{currentOrder.id}</h2>
            <p className="text-sm text-slate-500">Ngày đặt: {new Date(currentOrder.ngay_tao).toLocaleDateString('vi-VN')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="p-6 flex flex-col items-center justify-center gap-2 min-h-[300px]">
            <Loader size={40} className="text-blue-500 animate-spin" />
            <p className="text-slate-400 font-medium">Đang tải chi tiết...</p>
          </div>
        ) : (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Customer & Address Info */}
          <div className="md:col-span-1 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Khách hàng</h3>
              <p className="font-bold text-slate-800 mt-1">{currentOrder.user?.ten || currentOrder.ten_khach || 'Khách vãng lai'}</p>
              <p className="text-sm text-slate-500 mt-0.5">{currentOrder.user?.email || currentOrder.email || 'N/A'}</p>
              {(currentOrder.user?.so_dien_thoai || currentOrder.so_dien_thoai) && (
                <p className="text-sm text-slate-500">{currentOrder.user?.so_dien_thoai || currentOrder.so_dien_thoai}</p>
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Địa chỉ giao</h3>
              <p className="text-sm text-slate-700 mt-1">{currentOrder.address?.dia_chi || currentOrder.dia_chi || 'Không có thông tin'}</p>
            </div>

            {/* Status Update */}
            <div className="pt-4 border-t">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cập nhật trạng thái</h3>
              <select 
                value={newStatus || ''}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="cho_xu_ly">⏳ Chờ xử lý</option>
                <option value="dang_giao">📦 Đang giao</option>
                <option value="hoan_thanh">✅ Đã giao</option>
                <option value="da_huy">❌ Đã hủy</option>
              </select>
              {newStatus !== orderDetails?.trang_thai && (
                <button 
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-400 transition-all flex items-center justify-center gap-2"
                >
                  {updating ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
                  {updating ? 'Đang cập nhật...' : 'Lưu trạng thái'}
                </button>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Sản phẩm đã mua ({totalItems})</h3>
            <div style={{display: 'none'}}>DEBUG: items.length = {items.length}, items = {JSON.stringify(items)}</div>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold">
                  <tr>
                    <th className="px-4 py-2 text-left">Sách</th>
                    <th className="px-4 py-2 text-center">SL</th>
                    <th className="px-4 py-2 text-right">Giá</th>
                    <th className="px-4 py-2 text-right">Tổng</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.length > 0 ? (
                    items.map((item, idx) => {
                      console.log(`📚 Item ${idx}:`, item, 'book:', item.book);
                      const bookName = item.book?.ten_sach || item.sach?.ten_sach || item.ten_sach || `Sách ID: ${item.sach_id}`;
                      return (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {bookName}
                            {!item.book && (
                              <span className="text-xs text-red-500 block">(Book data missing)</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">{item.so_luong}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.gia || 0)}</td>
                          <td className="px-4 py-3 text-right font-bold text-blue-600">{formatCurrency((item.gia || 0) * item.so_luong)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-center text-slate-500">Không có sản phẩm</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Price Breakdown */}
            <div className="mt-4 text-right space-y-1 p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tạm tính:</span>
                <span className="font-medium">{formatCurrency(currentOrder.tong_tien || 0)}</span>
              </div>
              {currentOrder.payment && (
                <div className="flex justify-between text-sm text-slate-600 pt-2 border-t">
                  <span>Phương thức:</span>
                  <span className="font-medium">{currentOrder.payment.phuong_thuc || 'N/A'}</span>
                </div>
              )}
              {currentOrder.payment && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Trạng thái TT:</span>
                  <span className={`font-bold ${
                    currentOrder.payment.trang_thai === 'da_thanh_toan' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {currentOrder.payment.trang_thai === 'da_thanh_toan' ? '✅ Đã thanh toán' : '⏳ Chờ thanh toán'}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t mt-2">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all">
            <Printer size={18} /> In hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;