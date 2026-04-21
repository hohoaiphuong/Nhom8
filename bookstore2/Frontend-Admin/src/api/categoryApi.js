import client from './client';

export const categoryApi = {
  // Lấy danh sách danh mục
  getCategories: () => client.get('/categories'),

  // Lấy chi tiết 1 danh mục
  getCategory: (id) => client.get(`/categories/${id}`),

  // Thêm danh mục
  createCategory: (data) => client.post('/categories', data),

  // Cập nhật danh mục
  updateCategory: (id, data) => client.put(`/categories/${id}`, data),

  // Xóa danh mục
  deleteCategory: (id) => client.delete(`/categories/${id}`),
};
