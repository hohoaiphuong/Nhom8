import { useState, useEffect } from 'react';
import { Warehouse, Plus, Search, AlertCircle, Loader, TrendingDown, TrendingUp, Package } from 'lucide-react';
import { bookApi } from '../../api/bookApi';
import { categoryApi } from '../../api/categoryApi';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // State cho Modal nhập thêm số lượng
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [importQty, setImportQty] = useState('0');
  
  // Statistics
  const [stats, setStats] = useState({
    totalItems: 0,
    outOfStock: 0,
    lowStock: 0,
    totalValue: 0,
    avgPrice: 0
  });

  const MIN_STOCK_THRESHOLD = 10;
  const OUT_OF_STOCK = 0;

  // Fetch books and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const catResponse = await categoryApi.getCategories();
        setCategories(catResponse.data.data || []);
        
        // Fetch books
        const response = await bookApi.getBooks();
        const books = response.data.data || [];
        
        // Transform books data for inventory view
        const inventoryData = books.map(book => ({
          id: book.id,
          ten_sach: book.ten_sach,
          tac_gia: book.tac_gia,
          the_loai_id: book.the_loai_id,
          category: book.category?.ten || 'N/A',
          so_luong: book.so_luong || 0,
          gia: book.gia || 0,
          minStock: MIN_STOCK_THRESHOLD,
          status: book.so_luong === 0 ? 'out' : book.so_luong < MIN_STOCK_THRESHOLD ? 'low' : 'normal'
        }));
        
        setInventory(inventoryData);
        setFilteredInventory(inventoryData);
        
        // Calculate statistics
        const outOfStock = inventoryData.filter(i => i.so_luong === OUT_OF_STOCK).length;
        const lowStock = inventoryData.filter(i => i.so_luong > 0 && i.so_luong < MIN_STOCK_THRESHOLD).length;
        const totalValue = inventoryData.reduce((sum, item) => sum + (item.gia * item.so_luong), 0);
        const avgPrice = inventoryData.reduce((sum, item) => sum + item.gia, 0) / Math.max(inventoryData.length, 1);
        
        setStats({
          totalItems: inventoryData.reduce((sum, item) => sum + item.so_luong, 0),
          outOfStock,
          lowStock,
          totalValue,
          avgPrice
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Không thể tải dữ liệu kho hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter inventory
  useEffect(() => {
    let filtered = inventory;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.ten_sach.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tac_gia?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.the_loai_id === parseInt(categoryFilter));
    }

    setFilteredInventory(filtered);
  }, [searchTerm, statusFilter, categoryFilter, inventory]);

  // Confirm import (update stock)
  const confirmImport = async () => {
    if (!selectedItem || !importQty || parseInt(importQty) <= 0) {
      alert('Vui lòng nhập số lượng hợp lệ');
      return;
    }

    try {
      const newStock = selectedItem.so_luong + parseInt(importQty);
      await bookApi.updateBook(selectedItem.id, { so_luong: newStock });

      // Update local state
      const updatedInventory = inventory.map(item =>
        item.id === selectedItem.id
          ? { 
              ...item, 
              so_luong: newStock, 
              status: newStock === 0 ? 'out' : newStock < MIN_STOCK_THRESHOLD ? 'low' : 'normal'
            }
          : item
      );
      setInventory(updatedInventory);

      setIsImportModalOpen(false);
      setImportQty('0');
      setSelectedItem(null);
      alert('Cập nhật kho hàng thành công!');
    } catch (err) {
      console.error('Error updating inventory:', err);
      alert('Lỗi khi cập nhật kho hàng');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'out': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'low': return 'bg-amber-50 text-amber-600 border-amber-200';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'out': return '❌ Hết hàng';
      case 'low': return '⚠️ Sắp hết';
      default: return '✅ Đủ hàng';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Warehouse className="text-blue-600" /> Quản lý kho hàng
        </h1>
        <p className="text-sm text-slate-500">Theo dõi tồn kho, nhập thêm sách và quản lý mức hàng.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-xs text-blue-600 font-bold uppercase">Tồn kho (cuốn)</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalItems}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-xs text-emerald-600 font-bold uppercase">Đủ hàng</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{inventory.filter(i => i.status === 'normal').length}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-xs text-amber-600 font-bold uppercase">Sắp hết</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{stats.lowStock}</p>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-xl border border-rose-200 shadow-sm">
          <p className="text-xs text-rose-600 font-bold uppercase">Hết hàng</p>
          <p className="text-2xl font-bold text-rose-900 mt-1">{stats.outOfStock}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-xs text-purple-600 font-bold uppercase">Giá trị</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{(stats.totalValue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm tên sách hoặc tác giả..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select 
            className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="normal">✅ Đủ hàng</option>
            <option value="low">⚠️ Sắp hết</option>
            <option value="out">❌ Hết hàng</option>
          </select>

          {/* Category Filter */}
          <select 
            className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-600"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.ten}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
        ) : filteredInventory.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <AlertCircle size={40} className="text-slate-300" />
            <p className="text-slate-400 font-medium">Không tìm thấy sách nào.</p>
          </div>
        ) : (
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4 text-left">Sách</th>
              <th className="px-6 py-4 text-center">Danh mục</th>
              <th className="px-6 py-4 text-center">Tác giả</th>
              <th className="px-6 py-4 text-center">Tồn kho</th>
              <th className="px-6 py-4 text-center">Giá</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInventory.map((item) => (
              <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors group ${item.status === 'out' ? 'bg-rose-50/30' : item.status === 'low' ? 'bg-amber-50/30' : ''}`}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-slate-800">{item.ten_sach}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{item.category}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="text-sm text-slate-600">{item.tac_gia || 'N/A'}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className={`text-lg font-black ${item.status === 'out' ? 'text-rose-600' : item.status === 'low' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {item.so_luong}
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-bold text-blue-600">
                  {item.gia.toLocaleString()}đ
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setSelectedItem(item); setIsImportModalOpen(true); }}
                    className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 text-xs font-bold transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Plus size={14} className="inline mr-1" /> Nhập
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Import Modal */}
      {isImportModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Nhập thêm kho hàng</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 font-bold">Sách</p>
                <p className="font-bold text-slate-800 mt-1">{selectedItem.ten_sach}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedItem.tac_gia}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-bold">Tồn hiện tại</p>
                  <p className="text-2xl font-black text-blue-900 mt-1">{selectedItem.so_luong}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <p className="text-xs text-emerald-600 font-bold">Giá</p>
                  <p className="text-lg font-bold text-emerald-900 mt-1">{selectedItem.gia.toLocaleString()}đ</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Số lượng nhập thêm</label>
                <input 
                  type="number" 
                  min="1" 
                  value={importQty} 
                  onChange={(e) => setImportQty(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số lượng"
                  autoFocus
                />
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <p className="text-xs text-purple-600 font-bold">Tồn sau nhập</p>
                <p className="text-3xl font-black text-purple-900 mt-1">{selectedItem.so_luong + (parseInt(importQty) || 0)}</p>
                <p className="text-xs text-purple-600 mt-2">
                  Giá trị: <strong>{((selectedItem.so_luong + (parseInt(importQty) || 0)) * selectedItem.gia).toLocaleString()}đ</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={confirmImport}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all"
              >
                Xác nhận nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;