import client from './client';

export const addressApi = {
  // Lấy danh sách địa chỉ của người dùng
  getUserAddresses: (userId) => client.get(`/addresses/user/${userId}`),

  // Lấy chi tiết địa chỉ
  getAddress: (id) => client.get(`/addresses/${id}`),

  // Tạo địa chỉ mới
  createAddress: (data) => client.post('/addresses', data),

  // Cập nhật địa chỉ
  updateAddress: (id, data) => client.put(`/addresses/${id}`, data),

  // Xóa địa chỉ
  deleteAddress: (id) => client.delete(`/addresses/${id}`),
};
