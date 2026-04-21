import { X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

const AddressFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [dia_chi, setDia_chi] = useState('');
  const [mac_dinh, setMac_dinh] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDia_chi(initialData.dia_chi || '');
      setMac_dinh(initialData.mac_dinh || false);
    } else {
      setDia_chi('');
      setMac_dinh(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dia_chi.trim()) {
      alert('Địa chỉ không được để trống');
      return;
    }
    onSave({ dia_chi, mac_dinh });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          <div>
            <label className="text-sm font-bold text-slate-700">Địa chỉ *</label>
            <textarea 
              value={dia_chi}
              onChange={(e) => setDia_chi(e.target.value)}
              rows="3"
              className="w-full mt-1.5 p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nhập địa chỉ đầy đủ..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={mac_dinh}
              onChange={(e) => setMac_dinh(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-bold text-slate-700">Đặt làm địa chỉ mặc định</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-bold">Hủy</button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg transition-all active:scale-95">
              <Save size={18} /> Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
