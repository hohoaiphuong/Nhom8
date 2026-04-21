import client from './client';

export const ratingApi = {
  // Lấy danh sách đánh giá theo sách
  getBookRatings: (bookId) => client.get(`/ratings/book/${bookId}`),

  // Tạo đánh giá
  createRating: (data) => client.post('/ratings', data),

  // Xóa đánh giá
  deleteRating: (id) => client.delete(`/ratings/${id}`),
};
