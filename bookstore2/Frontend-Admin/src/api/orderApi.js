import client from './client';

export const orderApi = {
  // Lấy danh sách đơn hàng
  getOrders: () => client.get('/orders'),

  // Lấy đơn hàng theo người dùng
  getUserOrders: (userId) => client.get(`/orders/user/${userId}`),

  // Lấy chi tiết đơn hàng
  getOrder: (id) => client.get(`/orders/${id}`),

  // Tạo đơn hàng
  createOrder: (data) => client.post('/orders', data),

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: (id, trang_thai) => client.put(`/orders/${id}/status`, { trang_thai }),

  // Xóa đơn hàng
  deleteOrder: (id) => client.delete(`/orders/${id}`),
};
