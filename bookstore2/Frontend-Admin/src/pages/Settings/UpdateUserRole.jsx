import { useState } from 'react';
import { userApi } from '../../api/userApi';
import { UserCheck } from 'lucide-react';

const UpdateUserRole = () => {
  const [userId, setUserId] = useState('');
  const [vai_tro, setVaiTro] = useState('nguoi_dung');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('Vui lòng nhập User ID');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await userApi.updateUserRole(userId, vai_tro);
      
      if (response.data.success) {
        setMessage(`✅ Cập nhật vai trò thành công: ${response.data.data.ten} → ${vai_tro}`);
        setUser(response.data.data);
        setUserId('');
      } else {
        setError(response.data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Lỗi khi cập nhật vai trò');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserCheck className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Thay Đổi Vai Trò</h2>
        </div>

        <form onSubmit={handleUpdateRole} className="space-y-4">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Nhập User ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai Trò Mới
            </label>
            <select
              value={vai_tro}
              onChange={(e) => setVaiTro(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              <option value="nguoi_dung">Người Dùng</option>
              <option value="quan_tri">Quản Trị Viên</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang cập nhật...' : 'Cập Nhật Vai Trò'}
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Thông Tin Người Dùng</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Tên:</strong> {user.ten}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Vai Trò:</strong> <span className="font-bold">{user.vai_tro}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateUserRole;
