import { useState, useEffect } from 'react';
import { Star, Trash2, Search, Filter, AlertCircle, Loader, BookMarked } from 'lucide-react';
import { ratingApi } from '../../api/ratingApi';
import { bookApi } from '../../api/bookApi';

const RatingList = () => {
  const [books, setBooks] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [starFilter, setStarFilter] = useState('All');

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookApi.getBooks();
        setBooks(response.data.data || []);
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };
    
    fetchBooks();
  }, []);

  // Fetch ratings for selected book
  useEffect(() => {
    if (!selectedBook) {
      setRatings([]);
      setLoading(false);
      return;
    }

    const fetchRatings = async () => {
      try {
        setLoading(true);
        const response = await ratingApi.getBookRatings(selectedBook.id);
        setRatings(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching ratings:', err);
        setError('Không thể tải đánh giá');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [selectedBook]);

  const handleDelete = async (id) => {
    if (window.confirm('Xóa đánh giá này?')) {
      try {
        await ratingApi.deleteRating(id);
        setRatings(ratings.filter(r => r.id !== id));
      } catch (err) {
        console.error('Error deleting rating:', err);
        alert('Lỗi khi xóa đánh giá');
      }
    }
  };

  const filteredRatings = ratings.filter(rating => {
    const matchSearch = (rating.user?.ten || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStar = starFilter === 'All' || rating.so_sao === parseInt(starFilter);
    return matchSearch && matchStar;
  });

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + r.so_sao, 0) / ratings.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Star className="text-amber-500" /> Quản lý đánh giá sách
        </h1>
        <p className="text-slate-500 text-sm">Xem và quản lý đánh giá từ khách hàng.</p>
      </div>

      {/* Book Selection */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <label className="text-sm font-bold text-slate-700">Chọn cuốn sách để xem đánh giá</label>
        <div className="flex flex-wrap gap-2">
          {books.map(book => (
            <button
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedBook?.id === book.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {book.ten_sach}
            </button>
          ))}
        </div>
      </div>

      {selectedBook && (
        <>
          {/* Book Info & Stats */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedBook.ten_sach}</h2>
                <p className="text-sm text-slate-600">Tác giả: {selectedBook.tac_gia}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={18}
                        className={star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-amber-600">{averageRating}</span>
                </div>
                <p className="text-sm text-slate-600">{ratings.length} đánh giá</p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = ratings.filter(r => r.so_sao === stars).length;
                const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 w-8">{stars}★</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm theo tên người dùng..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border border-slate-200 rounded-xl px-4 py-2 outline-none bg-white font-medium text-slate-600"
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
            >
              <option value="All">Tất cả mức sao</option>
              <option value="5">★★★★★ 5 sao</option>
              <option value="4">★★★★ 4 sao</option>
              <option value="3">★★★ 3 sao</option>
              <option value="2">★★ 2 sao</option>
              <option value="1">★ 1 sao</option>
            </select>
          </div>

          {/* Ratings List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center gap-2">
                <Loader size={40} className="text-amber-500 animate-spin" />
                <p className="text-slate-400 font-medium">Đang tải đánh giá...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center flex flex-col items-center gap-2">
                <AlertCircle size={40} className="text-rose-500" />
                <p className="text-slate-600 font-medium">{error}</p>
              </div>
            ) : filteredRatings.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-2">
                <AlertCircle size={40} className="text-slate-300" />
                <p className="text-slate-400 font-medium">Không có đánh giá nào.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredRatings.map((rating) => (
                  <div key={rating.id} className="p-4 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-800">{rating.user?.ten || 'Ẩn danh'}</p>
                        <p className="text-xs text-slate-500">{rating.user?.email || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= rating.so_sao ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">
                          {new Date(rating.ngay_tao).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {rating.binh_luan && (
                      <p className="text-sm text-slate-700 mb-3 italic">"{rating.binh_luan}"</p>
                    )}
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDelete(rating.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!selectedBook && (
        <div className="py-20 text-center flex flex-col items-center gap-2">
          <BookMarked size={40} className="text-slate-300" />
          <p className="text-slate-400 font-medium">Chọn một cuốn sách để xem đánh giá.</p>
        </div>
      )}
    </div>
  );
};

export default RatingList;
