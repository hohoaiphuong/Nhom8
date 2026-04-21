import { bookApi } from '../api/bookApi';

// Lấy danh sách sách từ Backend
export const getBooks = async (filters = {}) => {
  try {
    const response = await bookApi.getBooks(filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Lấy chi tiết sách
export const getBook = async (id) => {
  try {
    const response = await bookApi.getBook(id);
    return response.data;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

// Thêm sách mới
export const createBook = async (bookData) => {
  try {
    const response = await bookApi.createBook(bookData);
    return response.data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

// Cập nhật sách
export const updateBook = async (id, bookData) => {
  try {
    const response = await bookApi.updateBook(id, bookData);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Xóa sách
export const deleteBook = async (id) => {
  try {
    const response = await bookApi.deleteBook(id);
    return response.data;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
