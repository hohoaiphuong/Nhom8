import client from './client';

export const cartApi = {
  // Lấy giỏ hàng của người dùng
  getCart: (userId) => client.get(`/cart/user/${userId}`),

  // Thêm sách vào giỏ
  addToCart: (userId, data) => client.post(`/cart/user/${userId}/add`, data),

  // Cập nhật số lượng
  updateCartItem: (userId, itemId, data) => client.put(`/cart/user/${userId}/item/${itemId}`, data),

  // Xóa item khỏi giỏ
  removeCartItem: (userId, itemId) => client.delete(`/cart/user/${userId}/item/${itemId}`),

  // Xóa toàn bộ giỏ hàng
  clearCart: (userId) => client.delete(`/cart/user/${userId}/clear`),

  // Admin: Lấy tất cả giỏ hàng (với thông tin người dùng)
  getAllCarts: () => client.get('/carts'),

  // Admin: Lấy chi tiết giỏ hàng
  getCartDetails: (userId) => client.get(`/carts/user/${userId}`),

  // Admin: Xóa item từ giỏ
  removeFromCart: (cartId, itemId) => client.delete(`/carts/${cartId}/items/${itemId}`),

  // Admin: Cập nhật số lượng item
  updateQuantity: (cartId, itemId, quantity) => client.put(`/carts/${cartId}/items/${itemId}`, { so_luong: quantity }),

  // Admin: Xóa toàn bộ giỏ
  clearCartAdmin: (cartId) => client.delete(`/carts/${cartId}`),
};
