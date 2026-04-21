import { X, Image as ImageIcon, Save, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

const BookFormModal = ({ isOpen, onClose, onSave, initialData, categories }) => {
  const initialState = {
    ten_sach: '',
    tac_gia: '',
    gia: '',
    so_luong: '',
    the_loai_id: '',
    mo_ta: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ten_sach: initialData.ten_sach || '',
        tac_gia: initialData.tac_gia || '',
        gia: initialData.gia || '',
        so_luong: initialData.so_luong || '',
        the_loai_id: initialData.the_loai_id || (categories.length > 0 ? categories[0].id : ''),
        mo_ta: initialData.mo_ta || ''
      });
      setPreview(initialData.hinh_anh);
      setImageFile(null);
    } else {
      setFormData({
        ...initialState,
        the_loai_id: categories.length > 0 ? categories[0].id : ''
      });
      setPreview(null);
      setImageFile(null);
    }
    setErrors({});
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Chỉ hỗ trợ ảnh định dạng: JPG, PNG, GIF' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Kích thước ảnh không vượt quá 5MB' }));
        return;
      }
      
      // Clear image error
      setErrors(prev => ({ ...prev, image: '' }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.ten_sach.trim()) {
      newErrors.ten_sach = 'Tên sách không được để trống';
    }
    
    if (!formData.gia || formData.gia <= 0) {
      newErrors.gia = 'Giá phải lớn hơn 0';
    }
    
    if (!formData.so_luong || formData.so_luong < 0) {
      newErrors.so_luong = 'Số lượng không hợp lệ';
    }
    
    if (!formData.the_loai_id) {
      newErrors.the_loai_id = 'Vui lòng chọn danh mục';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data to send
      const dataToSave = {
        ...formData,
        gia: parseInt(formData.gia),
        so_luong: parseInt(formData.so_luong),
        the_loai_id: parseInt(formData.the_loai_id)
      };

      // If there's a new image file, pass it to handler
      if (imageFile) {
        await onSave(dataToSave, imageFile);
      } else if (preview) {
        // Keep existing image (just pass the URL)
        dataToSave.hinh_anh = preview;
        await onSave(dataToSave);
      } else {
        await onSave(dataToSave);
      }
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        submit: 'Lỗi khi lưu sách: ' + (error.message || 'Vui lòng thử lại') 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === parseInt(id));
    return cat ? cat.ten : '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl flex justify-between items-center z-10">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? '✏️ Chỉnh sửa thông tin sách' : '➕ Thêm sách mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors" disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {/* Error message */}
          {errors.submit && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
              {errors.submit}
            </div>
          )}

          {/* Tên sách */}
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Tên sách *</label>
            <input 
              name="ten_sach" 
              value={formData.ten_sach} 
              onChange={handleChange} 
              type="text" 
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 transition-all ${
                errors.ten_sach ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'
              }`}
              placeholder="Nhập tên sách..." 
              disabled={isSubmitting}
            />
            {errors.ten_sach && <p className="text-xs text-rose-600 mt-1">{errors.ten_sach}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tác giả */}
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">Tác giả</label>
              <input 
                name="tac_gia" 
                value={formData.tac_gia} 
                onChange={handleChange} 
                type="text" 
                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Nguễn Hữu Thái"
                disabled={isSubmitting}
              />
            </div>

            {/* Danh mục */}
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">Danh mục *</label>
              <select 
                name="the_loai_id" 
                value={formData.the_loai_id} 
                onChange={handleChange} 
                className={`w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 transition-all ${
                  errors.the_loai_id ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Chọn danh mục...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.ten}</option>
                ))}
              </select>
              {errors.the_loai_id && <p className="text-xs text-rose-600 mt-1">{errors.the_loai_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Giá */}
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">Giá bán (đ) *</label>
              <input 
                name="gia" 
                value={formData.gia} 
                onChange={handleChange} 
                type="number" 
                className={`w-full p-3 border rounded-lg outline-none focus:ring-2 transition-all ${
                  errors.gia ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'
                }`}
                placeholder="50000"
                disabled={isSubmitting}
              />
              {errors.gia && <p className="text-xs text-rose-600 mt-1">{errors.gia}</p>}
            </div>

            {/* Số lượng */}
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">Số lượng tồn *</label>
              <input 
                name="so_luong" 
                value={formData.so_luong} 
                onChange={handleChange} 
                type="number" 
                className={`w-full p-3 border rounded-lg outline-none focus:ring-2 transition-all ${
                  errors.so_luong ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'
                }`}
                placeholder="10"
                disabled={isSubmitting}
              />
              {errors.so_luong && <p className="text-xs text-rose-600 mt-1">{errors.so_luong}</p>}
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Mô tả tóm tắt</label>
            <textarea 
              name="mo_ta" 
              value={formData.mo_ta} 
              onChange={handleChange} 
              rows="3" 
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Nhập mô tả sách..."
              disabled={isSubmitting}
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Hình ảnh bìa</label>
            <div className="flex gap-4 items-start">
              <label className="w-32 h-44 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden flex-shrink-0">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="text-slate-300 mx-auto mb-2" size={32} />
                    <span className="text-[11px] text-slate-400">Nhấn để chọn ảnh</span>
                  </div>
                )}
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*" 
                  disabled={isSubmitting}
                />
              </label>
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-2">💡 Định dạng: JPG, PNG (tối đa 5MB)</p>
                {preview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setImageFile(null);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                    disabled={isSubmitting}
                  >
                    ✕ Xóa ảnh
                  </button>
                )}
                {errors.image && <p className="text-xs text-rose-600">{errors.image}</p>}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Save size={18} /> {initialData ? 'Cập nhật' : 'Thêm sách'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;
