# STU Book - User Frontend

Frontend người dùng cho cửa hàng bán sách online STU Book, xây dựng bằng React.js + Vite.

## Tính năng

- ✅ Xem danh sách sách với phân trang
- ✅ Tìm kiếm sách
- ✅ Lọc sách theo danh mục
- ✅ Xem chi tiết sản phẩm
- ✅ Giỏ hàng (lưu trong localStorage)
- ✅ Thanh toán đơn hàng
- ✅ Tài khoản người dùng
- ✅ Quản lý wishlist
- ✅ Responsive design

## Công nghệ

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons
- React Toastify

## Cài đặt

\`\`\`bash
npm install
\`\`\`

## Chạy ứng dụng

### Development
\`\`\`bash
npm run dev
\`\`\`

Mở http://localhost:5174 trong trình duyệt.

### Build
\`\`\`bash
npm run build
\`\`\`

## Cấu trúc thư mục

```
src/
├── components/        # Các component dùng chung
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── Banner.jsx
├── pages/             # Các trang chính
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Account.jsx
│   ├── OrderSuccess.jsx
│   ├── Search.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── context/           # React Context
│   └── CartContext.jsx
├── api/               # API calls
│   └── bookAPI.js
├── App.jsx            # Main App component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Liên kết với backend

Chỉnh sửa API_BASE_URL trong `src/api/bookAPI.js` để kết nối với backend:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## Liên kết với frontend-admin

Cả hai frontend đều được thiết kế để kết nối với cùng một backend API, cho phép admin quản lý dữ liệu từ frontend-admin trong khi người dùng mua hàng từ frontend-user.

## Tác giả

Nhóm 8 - Dự án e-commerce sách
