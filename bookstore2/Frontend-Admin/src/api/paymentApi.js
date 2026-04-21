import client from './client';

export const paymentApi = {
  // Lấy danh sách thanh toán
  getPayments: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.trang_thai) params.append('trang_thai', filters.trang_thai);
    if (filters.phuong_thuc) params.append('phuong_thuc', filters.phuong_thuc);
    return client.get(`/payments?${params.toString()}`);
  },

  // Lấy chi tiết thanh toán
  getPayment: (id) => client.get(`/payments/${id}`),

  // Lấy thanh toán theo đơn hàng
  getOrderPayment: (orderId) => client.get(`/payments/order/${orderId}`),

  // Tạo thanh toán
  createPayment: (data) => client.post('/payments', data),

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus: (id, trang_thai) => client.put(`/payments/${id}`, { trang_thai }),

  // Xóa thanh toán
  deletePayment: (id) => client.delete(`/payments/${id}`),
};
