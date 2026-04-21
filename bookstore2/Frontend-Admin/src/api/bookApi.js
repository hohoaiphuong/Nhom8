import client, { uploadClient } from './client';

export const bookApi = {
  // Lấy danh sách sách với filters
  getBooks: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    return client.get(`/books?${params.toString()}`);
  },

  // Lấy chi tiết 1 sách
  getBook: (id) => client.get(`/books/${id}`),

  // Upload book image
  uploadBookImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    return uploadClient.post('/upload/book-image', formData);
  },

  // Thêm sách mới
  createBook: (data) => client.post('/books', data),

  // Cập nhật sách
  updateBook: (id, data) => client.put(`/books/${id}`, data),

  // Xóa sách
  deleteBook: (id) => client.delete(`/books/${id}`),
};
