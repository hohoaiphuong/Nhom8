import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Filter, BookOpen, AlertCircle, Loader, TrendingUp } from 'lucide-react';
import BookFormModal from './BookFormModal';
import { bookApi } from '../../api/bookApi';
import { categoryApi } from '../../api/categoryApi';

const BookList = () => {
  // State quản lý danh sách
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalValue: 0,
    avgPrice: 0,
    lowStockCount: 0
  });

  // Fetch books and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [booksRes, categoriesRes] = await Promise.all([
          bookApi.getBooks(),
          categoryApi.getCategories()
        ]);
        
        const booksList = booksRes.data.data || [];
        const categoriesList = categoriesRes.data.data || [];
        
        setBooks(booksList);
        setCategories(categoriesList);
        
        // Calculate statistics
        const totalBooks = booksList.length;
        const totalValue = booksList.reduce((sum, book) => sum + (Number(book.gia) * Number(book.so_luong) || 0), 0);
        const avgPrice = totalBooks > 0 ? booksList.reduce((sum, book) => sum + Number(book.gia), 0) / totalBooks : 0;
        const lowStockCount = booksList.filter(book => Number(book.so_luong) < 10).length;
        
        setStats({ totalBooks, totalValue, avgPrice, lowStockCount });
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Xử lý Thêm / Sửa
  const handleSaveBook = async (data, imageFile) => {
    try {
      let bookData = { ...data };

      // Upload image if provided
      if (imageFile) {
        try {
          const uploadResponse = await bookApi.uploadBookImage(imageFile);
          bookData.hinh_anh = uploadResponse.data.data.url; // Get URL from response
        } catch (uploadErr) {
          console.error('Error uploading image:', uploadErr);
          let errorMsg = 'Lỗi khi tải ảnh lên';
          
          if (uploadErr.response?.data?.errors) {
            // Handle validation errors
            const errors = uploadErr.response.data.errors;
            const firstError = Object.values(errors)[0];
            errorMsg += ': ' + (Array.isArray(firstError) ? firstError[0] : firstError);
          } else if (uploadErr.response?.data?.error) {
            errorMsg += ': ' + uploadErr.response.data.error;
          } else if (uploadErr.message) {
            errorMsg += ': ' + uploadErr.message;
          }
          
          throw new Error(errorMsg);
        }
      }

      // Save book
      if (editingBook) {
        await bookApi.updateBook(editingBook.id, bookData);
        setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...bookData } : b));
      } else {
        const response = await bookApi.createBook(bookData);
        setBooks([response.data.data || { id: Date.now(), ...bookData }, ...books]);
      }
      setIsModalOpen(false);
      setEditingBook(null);
    } catch (err) {
      console.error('Error saving book:', err);
      throw err; // Re-throw so BookFormModal can catch it
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa cuốn sách này?")) {
      try {
        await bookApi.deleteBook(id);
        setBooks(books.filter(b => b.id !== id));
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Lỗi khi xóa sách');
      }
    }
  };

  // Logic Lọc & Tìm kiếm
  const filteredBooks = books.filter(book => {
    const matchSearch = (book.ten_sach || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (book.tac_gia || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || book.the_loai_id === parseInt(filterCategory);
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" /> Quản lý sách
          </h1>
          <p className="text-slate-500 text-sm">Quản lý toàn bộ danh mục sách, giá cả và tồn kho.</p>
        </div>
        <button 
          onClick={() => { setEditingBook(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
        >
          <Plus size={20} /> Thêm sách mới
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-xs text-blue-600 font-bold uppercase">Tổng số sách</p>
          <p className="text-3xl font-black text-blue-900 mt-2">{stats.totalBooks}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-xs text-emerald-600 font-bold uppercase">Giá trị kho</p>
          <p className="text-2xl font-black text-emerald-900 mt-2">{(stats.totalValue / 1000000).toFixed(1)}M</p>
          <p className="text-[11px] text-emerald-600 mt-1">đ</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-xs text-purple-600 font-bold uppercase">Giá trung bình</p>
          <p className="text-2xl font-black text-purple-900 mt-2">{Math.round(stats.avgPrice / 1000)}k</p>
          <p className="text-[11px] text-purple-600 mt-1">đ/cuốn</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-xs text-amber-600 font-bold uppercase">Sắp hết hàng</p>
          <p className="text-3xl font-black text-amber-900 mt-2">{stats.lowStockCount}</p>
          <p className="text-[11px] text-amber-600 mt-1">&lt; 10 cuốn</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên sách hoặc tác giả..." 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="flex-1 md:flex-none border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white font-medium text-slate-600 focus:ring-2 focus:ring-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.ten}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <Loader size={40} className="text-blue-500 animate-spin" />
            <p className="text-slate-400 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <AlertCircle size={40} className="text-rose-500" />
            <p className="text-slate-600 font-medium">{error}</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Sách</th>
                <th className="px-6 py-4 text-center">Danh mục</th>
                <th className="px-6 py-4 text-center">Tác giả</th>
                <th className="px-6 py-4 text-center">Giá</th>
                <th className="px-6 py-4 text-center">Kho</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-slate-100 rounded shadow-sm overflow-hidden flex-shrink-0 border border-slate-200">
                          {book.hinh_anh ? <img src={book.hinh_anh} alt={book.ten_sach} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-2">{book.ten_sach}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{book.category?.ten || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">{book.tac_gia || 'N/A'}</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">
                      {Number(book.gia).toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-lg inline-block border ${book.so_luong < 10 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {book.so_luong} cuốn
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(book)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-100 shadow-sm transition-colors" title="Sửa"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(book.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 shadow-sm transition-colors" title="Xóa"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <AlertCircle size={40} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 font-medium">Không tìm thấy sách nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Modal */}
      <BookFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingBook(null); }} 
        onSave={handleSaveBook}
        initialData={editingBook}
        categories={categories}
      />
    </div>
  );
};

export default BookList;