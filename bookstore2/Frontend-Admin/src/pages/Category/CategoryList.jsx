import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, ListTree, AlertCircle, Loader, Search } from 'lucide-react';
import CategoryFormModal from './CategoryFormModal';
import { categoryApi } from '../../api/categoryApi';
import { bookApi } from '../../api/bookApi';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [stats, setStats] = useState({ totalCategories: 0, totalBooks: 0 });

  // Fetch categories and books from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, booksRes] = await Promise.all([
          categoryApi.getCategories(),
          bookApi.getBooks()
        ]);
        
        const categoriesList = categoriesRes.data.data || [];
        const booksList = booksRes.data.data || [];
        
        setCategories(categoriesList);
        setBooks(booksList);
        setStats({
          totalCategories: categoriesList.length,
          totalBooks: booksList.length
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id, data);
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...data } : c));
      } else {
        const response = await categoryApi.createCategory(data);
        setCategories([...categories, response.data.data]);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Lỗi khi lưu danh mục');
    }
  };

  const handleDelete = async (id) => {
    const bookCount = books.filter(b => b.the_loai_id === id).length;
    if (window.confirm(`Danh mục này có ${bookCount} cuốn sách. Xóa danh mục sẽ ảnh hưởng đến các sách. Bạn chắc chứ?`)) {
      try {
        await categoryApi.deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
        setStats(prev => ({ ...prev, totalCategories: prev.totalCategories - 1 }));
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Lỗi khi xóa danh mục');
      }
    }
  };

  // Get book count for a category
  const getBookCount = (categoryId) => {
    return books.filter(b => b.the_loai_id === categoryId).length;
  };

  // Filter and sort categories by search term and name
  const filteredCategories = categories
    .filter(cat => cat.ten.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.ten.localeCompare(b.ten, 'vi-VN'));

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500 space-y-6 text-left flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader size={40} className="text-blue-500 animate-spin" />
          <p className="text-slate-400 font-medium">Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in duration-500 space-y-6 text-left flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle size={40} className="text-rose-500" />
          <p className="text-slate-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ListTree className="text-blue-600" /> Quản lý danh mục
          </h1>
          <p className="text-slate-500 text-sm">Phân loại sách để khách hàng dễ dàng tìm kiếm và lọc.</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} /> Thêm danh mục
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-xs text-blue-600 font-bold uppercase">Tổng danh mục</p>
          <p className="text-3xl font-black text-blue-900 mt-2">{stats.totalCategories}</p>
          <p className="text-[11px] text-blue-600 mt-1">loại</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-xs text-emerald-600 font-bold uppercase">Tổng sách</p>
          <p className="text-3xl font-black text-emerald-900 mt-2">{stats.totalBooks}</p>
          <p className="text-[11px] text-emerald-600 mt-1">cuốn</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm danh mục..." 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const bookCount = getBookCount(cat.id);
          return (
            <div key={cat.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100">
                  {bookCount} sách
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"
                    title="Sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)} 
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 line-clamp-2">{cat.ten}</h3>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">ID: <span className="font-mono font-bold text-slate-700">{cat.id}</span></p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-2 col-span-full">
          <AlertCircle size={40} className="text-slate-300" />
          <p className="text-slate-400 font-medium">{searchTerm ? 'Không tìm thấy danh mục nào.' : 'Chưa có danh mục nào.'}</p>
        </div>
      )}

      <CategoryFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        initialData={editingCategory}
      />
    </div>
  );
};

export default CategoryList;