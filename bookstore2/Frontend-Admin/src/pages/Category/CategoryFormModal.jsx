import { X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

const CategoryFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [ten, setTen] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTen(initialData.ten);
      } else {
        setTen('');
      }
      setError('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!ten.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }
    
    if (ten.trim().length < 2) {
      setError('Tên danh mục phải có ít nhất 2 ký tự');
      return;
    }

    if (ten.trim().length > 100) {
      setError('Tên danh mục không được vượt quá 100 ký tự');
      return;
    }

    onSave({ ten: ten.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
        <div className="p-5 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? '✏️ Sửa danh mục' : '➕ Thêm danh mục mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {/* Tên danh mục */}
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Tên danh mục *</label>
            <input 
              value={ten} 
              onChange={(e) => {
                setTen(e.target.value);
                setError('');
              }}
              type="text" 
              className={`w-full p-3 border rounded-xl outline-none focus:ring-2 transition-all ${
                error ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'
              }`}
              placeholder="VD: Công nghệ thông tin, Văn học..." 
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}
              <p className="text-xs text-slate-400 ml-auto">{ten.length}/100</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <Save size={18} /> {initialData ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;