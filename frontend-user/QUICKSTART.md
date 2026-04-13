# Quick Start - Frontend User

## Bắt đầu nhanh

### 1. Cài đặt dependencies

```bash
cd frontend-user
npm install
```

### 2. Cấu hình biến môi trường

Sao chép `.env.example` thành `.env.local`:

```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local` nếu cần:

```
VITE_API_URL=http://localhost:3000/api
```

### 3. Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt: http://localhost:5174

## Các lệnh npm

- `npm run dev` - Chạy dev server
- `npm run build` - Build cho production
- `npm run preview` - Xem preview build
- `npm run lint` - Kiểm tra linting

## Tính năng chính

**Trang chủ (Home)**
- Banner slider
- Sách được recommend
- Danh mục sản phẩm
- Thông tin khuyến mãi

**Cửa hàng (Shop)**
- Danh sách sách
- Lọc theo danh mục
- Lọc theo khoảng giá
- Sắp xếp theo giá/popularity
- Phân trang

**Chi tiết sản phẩm (ProductDetail)**
- Hình ảnh sản phẩm
- Mô tả chi tiết
- Rating và reviews
- Thêm vào giỏ/wishlist
- Các sản phẩm liên quan

**Giỏ hàng (Cart)**
- Xem danh sách sách
- Thay đổi số lượng
- Xóa sách
- Tính tổng tiền
- Lưu trữ persistent

**Thanh toán (Checkout)**
- Nhập thông tin giao hàng
- Chọn phương thức thanh toán
- Xác nhận đơn hàng

**Tài khoản (Account)**
- Xem thông tin cá nhân
- Quản lý đơn hàng
- Wishlist
- Địa chỉ giao hàng

**Tìm kiếm (Search)**
- Tìm sách theo từ khóa
- Hiển thị kết quả

**Thông tin**
- Về chúng tôi (About)
- Liên hệ (Contact)

## Cấu trúc thư mục chi tiết

```
frontend-user/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx      # Header/Navigation
│   │   ├── Footer.jsx      # Footer
│   │   ├── ProductCard.jsx # Product card component
│   │   └── Banner.jsx      # Banner slider
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Trang chủ
│   │   ├── Shop.jsx        # Cửa hàng
│   │   ├── ProductDetail.jsx # Chi tiết sản phẩm
│   │   ├── Cart.jsx        # Giỏ hàng
│   │   ├── Checkout.jsx    # Thanh toán
│   │   ├── Account.jsx     # Tài khoản
│   │   ├── OrderSuccess.jsx # Đơn hàng thành công
│   │   ├── Search.jsx      # Tìm kiếm
│   │   ├── About.jsx       # Về chúng tôi
│   │   └── Contact.jsx     # Liên hệ
│   ├── context/            # React Context
│   │   └── CartContext.jsx # Cart state management
│   ├── api/                # API calls
│   │   └── bookAPI.js      # Book, order, user APIs
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── .env.example            # Example env
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## Styling

Dự án sử dụng **Tailwind CSS** cho styling.

### Sử dụng Tailwind

```jsx
<div className="bg-pink-600 text-white rounded-lg p-4">
  Tailwind classes
</div>
```

### Màu sắc chính

- Primary: `#E91E63` (pink)
- Secondary: `#FF6B35` (orange)
- Accent: `#FFA500` (amber)

## State Management

### CartContext

Quản lý giỏ hàng:

```jsx
import { useCart } from './context/CartContext';

const { cart, addToCart, removeFromCart, getTotalPrice } = useCart();
```

## API Integration

### Gọi API

```jsx
import { bookAPI } from './api/bookAPI';

// Lấy sách
const response = await bookAPI.getBooks(page, limit);

// Lấy chi tiết sách
const book = await bookAPI.getBookById(id);
```

### Interceptor

Tự động thêm token vào header:

```javascript
// src/api/bookAPI.js
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Lưu ý

1. Dữ liệu giỏ hàng được lưu trong `localStorage`
2. Dữ liệu mock mặc định - thay bằng API thực
3. Cần backend API chạy trên port 3000
4. Hỗ trợ mobile responsive

## Liên hệ & Support

Website: https://stubook.vn
Email: support@stubook.vn
Hotline: 1900.xxxx.xxxx
