import { X, Save, Loader } from 'lucide-react';
import { useState } from 'react';
import { orderApi } from '../../api/orderApi';
import { paymentApi } from '../../api/paymentApi';

const PaymentDetailModal = ({ isOpen, onClose, order, onUpdateSuccess }) => {
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(order?.payment?.trang_thai || 'cho_xu_ly');

  if (!isOpen || !order) return null;

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      // Update payment status via API
      if (order.payment?.id) {
        await paymentApi.updatePaymentStatus(order.payment.id, newStatus);
        // Update the order with new payment status
        const updatedOrder = {
          ...order,
          payment: {
            ...order.payment,
            trang_thai: newStatus
          }
        };
        // Call callback to update parent component
        if (onUpdateSuccess) {
          onUpdateSuccess(updatedOrder);
        }
      }
      onClose();
    } catch (err) {
      console.error('Error updating payment:', err);
      alert('Lỗi khi cập nhật thanh toán');
    } finally {
      setUpdating(false);
    }
  };

  const payment = order.payment || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Chi tiết thanh toán</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Order Info */}
          <div className="pb-4 border-b">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Đơn hàng</h3>
            <p className="font-bold text-slate-800">#{order.id}</p>
            <p className="text-sm text-slate-600">{order.user?.ten || order.ten_khach || 'N/A'}</p>
          </div>

          {/* Amount */}
          <div className="pb-4 border-b">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Số tiền</h3>
            <p className="text-2xl font-bold text-blue-600">{(order.tong_tien || 0).toLocaleString()}đ</p>
          </div>

          {/* Payment Method */}
          <div className="pb-4 border-b">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Phương thức thanh toán</h3>
            <p className="text-sm text-slate-700">{payment.phuong_thuc || 'Chưa xác định'}</p>
          </div>

          {/* Payment Status */}
          <div className="pb-4 border-b">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Cập nhật trạng thái</h3>
            <select 
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="cho_xu_ly">⏳ Chờ thanh toán</option>
              <option value="da_thanh_toan">✅ Đã thanh toán</option>
            </select>
          </div>

          {/* Current Status */}
          <div className="pb-4 border-b">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Trạng thái hiện tại</h3>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border inline-block ${
              payment.trang_thai === 'da_thanh_toan'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {payment.trang_thai === 'da_thanh_toan' ? '✅ Đã thanh toán' : '⏳ Chờ thanh toán'}
            </span>
          </div>

          {/* Date Created */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Ngày tạo đơn</h3>
            <p className="text-sm text-slate-600">
              {new Date(order.ngay_tao).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-white transition-all"
          >
            Đóng
          </button>
          <button 
            onClick={handleUpdateStatus}
            disabled={updating || newStatus === payment.trang_thai}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-400 transition-all flex items-center justify-center gap-2"
          >
            {updating ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
            {updating ? 'Cập nhật...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
