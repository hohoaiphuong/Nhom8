import client from './client';

export const userApi = {
  // Lấy danh sách người dùng
  getUsers: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.vai_tro) params.append('vai_tro', filters.vai_tro);
    if (filters.per_page) params.append('per_page', filters.per_page);
    return client.get(`/users?${params.toString()}`);
  },

  // Lấy chi tiết người dùng
  getUser: (id) => client.get(`/users/${id}`),

  // Lấy thống kê người dùng
  getStatistics: () => client.get('/users/statistics'),

  // Tạo người dùng mới
  createUser: (data) => client.post('/users', data),

  // Cập nhật người dùng
  updateUser: (id, data) => client.put(`/users/${id}`, data),

  // Cập nhật vai trò người dùng
  updateUserRole: (id, vai_tro) => client.put(`/users/${id}/role`, { vai_tro }),

  // Xóa người dùng
  deleteUser: (id) => client.delete(`/users/${id}`),
};
