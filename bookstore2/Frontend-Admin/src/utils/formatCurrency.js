export const formatCurrency = (value) => {
  if (!value) return '0đ';
  return Number(value).toLocaleString('vi-VN') + 'đ';
};
