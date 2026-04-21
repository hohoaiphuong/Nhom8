import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Search, Filter, Loader, AlertCircle } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { addressApi } from '../../api/addressApi';
import AddressFormModal from './AddressFormModal';

const AddressList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userApi.getUsers();
        setUsers(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch addresses for selected user
  useEffect(() => {
    if (!selectedUser) {
      setAddresses([]);
      return;
    }

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await addressApi.getUserAddresses(selectedUser.id);
        setAddresses(response.data.data || []);
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [selectedUser]);

  const handleDelete = async (id) => {
    if (window.confirm('Xóa địa chỉ này?')) {
      try {
        await addressApi.deleteAddress(id);
        setAddresses(addresses.filter(a => a.id !== id));
      } catch (err) {
        console.error('Error deleting address:', err);
        alert('Lỗi khi xóa địa chỉ');
      }
    }
  };

  const handleSaveAddress = async (data) => {
    try {
      if (editingAddress) {
        await addressApi.updateAddress(editingAddress.id, data);
        setAddresses(addresses.map(a => a.id === editingAddress.id ? { ...a, ...data } : a));
      } else {
        const response = await addressApi.createAddress({
          ...data,
          nguoi_dung_id: selectedUser.id
        });
        setAddresses([...addresses, response.data.data]);
      }
      setIsModalOpen(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Lỗi khi lưu địa chỉ');
    }
  };

  const filteredAddresses = addresses.filter(addr =>
    addr.dia_chi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.ten.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="text-green-600" /> Quản lý địa chỉ
        </h1>
        <p className="text-slate-500 text-sm">Quản lý địa chỉ giao hàng của khách hàng.</p>
      </div>

      {/* User Selection */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <label className="text-sm font-bold text-slate-700 block mb-3">Chọn người dùng</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm theo tên người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all mb-3"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
          {filteredUsers.map(user => (
            <button
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                setSearchTerm('');
              }}
              className={`p-3 rounded-lg text-left transition-all border-2 ${
                selectedUser?.id === user.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-200 bg-white hover:border-green-300'
              }`}
            >
              <p className="font-bold text-slate-800">{user.ten}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedUser && (
        <>
          {/* Header with Add Button */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{selectedUser.ten}</h2>
              <p className="text-sm text-slate-500">{selectedUser.email}</p>
            </div>
            <button 
              onClick={() => {
                setEditingAddress(null);
                setIsModalOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95 font-bold"
            >
              <Plus size={20} /> Thêm địa chỉ
            </button>
          </div>

          {/* Addresses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center gap-2 col-span-full">
                <Loader size={40} className="text-green-500 animate-spin" />
                <p className="text-slate-400 font-medium">Đang tải địa chỉ...</p>
              </div>
            ) : filteredAddresses.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-2 col-span-full">
                <AlertCircle size={40} className="text-slate-300" />
                <p className="text-slate-400 font-medium">Chưa có địa chỉ nào.</p>
              </div>
            ) : (
              filteredAddresses.map(address => (
                <div
                  key={address.id}
                  className={`p-4 rounded-xl border-2 transition-all group hover:shadow-md ${
                    address.mac_dinh ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-2">
                      <MapPin size={18} className="text-green-600 mt-1" />
                      <div>
                        {address.mac_dinh && (
                          <span className="inline-block px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded mb-1 mr-2">
                            MẶC ĐỊNH
                          </span>
                        )}
                        <p className="font-bold text-slate-800">{address.dia_chi}</p>
                        <p className="text-xs text-slate-500 mt-1">ID: #{address.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingAddress(address);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(address.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {!selectedUser && (
        <div className="py-20 text-center flex flex-col items-center gap-2">
          <MapPin size={40} className="text-slate-300" />
          <p className="text-slate-400 font-medium">Chọn một người dùng để xem địa chỉ.</p>
        </div>
      )}

      <AddressFormModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        initialData={editingAddress}
      />
    </div>
  );
};

export default AddressList;
