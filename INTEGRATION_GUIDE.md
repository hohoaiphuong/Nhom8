# Hướng dẫn tích hợp hệ thống

## Cấu trúc hệ thống

```
WAKA Books E-Commerce Platform
├── Backend (API)
│   └── Cung cấp API cho cả admin và user frontend
├── Frontend Admin (frontend-admin)
│   └── Quản lý sách, danh mục, đơn hàng
└── Frontend User (frontend-user)
    └── Mua sắm sách
```

## Yêu cầu hệ thống

- Node.js v16+ 
- npm v8+
- Backend API chạy trên port 3000

## Hướng dẫn cài đặt

### 1. Backend API

Đảm bảo backend đang chạy trên `http://localhost:3000`

API Endpoints cần cung cấp:
- `GET /api/books` - Lấy danh sách sách
- `GET /api/books/:id` - Chi tiết sách
- `GET /api/categories` - Danh mục
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/users/profile` - Profile người dùng
- `POST /api/users/login` - Đăng nhập
- `POST /api/users/register` - Đăng ký

### 2. Frontend Admin (Port 5173)

```bash
cd frontend-admin
npm install
npm run dev
```

Truy cập: http://localhost:5173

### 3. Frontend User (Port 5174)

```bash
cd frontend-user
npm install
npm run dev
```

Truy cập: http://localhost:5174

## Cấu hình API

### Frontend User

Chỉnh sửa file `.env` hoặc `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
```

### Frontend Admin

Chỉnh sửa cấu hình trong file `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

## Luồng dữ liệu

### Admin
1. Admin truy cập `http://localhost:5173`
2. Admin đăng nhập vào hệ thống
3. Admin quản lý sách: Thêm, sửa, xóa sách
4. Admin quản lý danh mục
5. Admin xem đơn hàng

### User
1. User truy cập `http://localhost:5174`
2. User xem danh sách sách
3. User thêm sách vào giỏ
4. User thanh toán đơn hàng
5. User xem lịch sử mua hàng

## Đăng nhập và xác thực

### JWT Token
- Sau khi đăng nhập, backend sẽ cấp JWT token
- Token được lưu trong `localStorage`
- Token được gửi kèm trong header Authorization của mỗi request

Frontend User sẽ tự động gửi token:
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

## Triển khai (Deployment)

### Frontend User
```bash
npm run build
# Kết quả ở thư mục `dist/`
```

### Frontend Admin
```bash
npm run build
# Kết quả ở thư mục `dist/`
```

Có thể triển khai trên:
- Vercel
- Netlify
- GitHub Pages
- Docker

## Lưu ý quan trọng

1. **CORS**: Đảm bảo backend cho phép CORS từ các domain của frontend
2. **Biến môi trường**: Cấu hình đúng API URL cho từng môi trường (dev, staging, production)
3. **Database**: Đảm bảo database được khởi tạo đúng trên backend
4. **Token**: Kiểm tra thời hạn token và xử lý refresh token nếu cần

## Troubleshooting

### Lỗi CORS
- Kiểm tra cấu hình CORS trên backend
- Đảm bảo frontend URL được thêm vào whitelist

### Lỗi 404 API
- Kiểm tra backend service đang chạy
- Kiểm tra cấu hình API URL
- Kiểm tra endpoints backend

### Lỗi xác thực
- Kiểm tra token được lưu trong localStorage
- Kiểm tra JWT secret trên backend
- Kiểm tra thời hạn token

## Hỗ trợ

Liên hệ: support@waka.vn
Hotline: 1900.xxxx.xxxx
