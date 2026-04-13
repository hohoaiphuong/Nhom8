# 📚 STU Book - Frontend User (Complete Project)

Đã tạo thành công một website bán sách e-commerce hoàn chỉnh dành cho người dùng

## 🎯 Tổng quan dự án

- **Loại dự án**: React.js E-Commerce Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context (Cart)
- **API Client**: Axios
- **Icons**: Lucide React
- **Port**: 5174 (Development)

## 📁 Cấu trúc tệp được tạo

### Config Files
```
frontend-user/
├── package.json                    ✅ Dependencies & scripts
├── vite.config.js                  ✅ Vite configuration
├── tailwind.config.js              ✅ Tailwind CSS config
├── postcss.config.js               ✅ PostCSS config
├── eslint.config.js                ✅ ESLint rules
├── index.html                      ✅ HTML template
├── .env                            ✅ Environment variables
├── .env.example                    ✅ Environment template
├── .gitignore                      ✅ Git ignore rules
├── .lintstagedrc.js               ✅ Lint staged config
└── README.md                       ✅ Project documentation
```

### Source Code - Components (src/components/)
```
✅ Header.jsx                       # Navigation bar + search
✅ Footer.jsx                       # Footer with links
✅ ProductCard.jsx                  # Product card component
✅ Banner.jsx                       # Hero banner slider
```

### Source Code - Pages (src/pages/)
```
✅ Home.jsx                         # Trang chủ - Featured books
✅ Shop.jsx                         # Cữu hàng - List & filter
✅ ProductDetail.jsx                # Chi tiết sách - Buy page
✅ Cart.jsx                         # Giỏ hàng
✅ Checkout.jsx                     # Thanh toán
✅ Account.jsx                      # Tài khoản người dùng
✅ OrderSuccess.jsx                 # Đơn hàng thành công
✅ Search.jsx                       # Tìm kiếm sách
✅ About.jsx                        # Về chúng tôi
✅ Contact.jsx                      # Liên hệ
```

### Source Code - Logic (src/)
```
✅ App.jsx                          # Main App + Router
✅ main.jsx                         # Entry point
✅ index.css                        # Global styles

src/api/
✅ bookAPI.js                       # API client & calls

src/context/
✅ CartContext.jsx                  # Cart state management
```

### Documentation Files
```
✅ README.md                        # Project docs
✅ QUICKSTART.md                    # Quick start guide
✅ INTEGRATION_GUIDE.md (root)      # Integration with admin
```

### Public Assets
```
✅ public/_redirects                # Netlify redirects
```

## ✨ Tính năng chính

### Home Page
- 🎨 Banner slider tự động
- 📚 Sách được recommend
- 🏷️ Danh mục sản phẩm
- 💰 Thông tin khuyến mãi

### Shop Page
- 📋 Danh sách sách với phân trang
- 🔍 Tìm kiếm theo từ khóa
- 🏷️ Lọc theo danh mục
- 💵 Lọc theo khoảng giá
- 📊 Sắp xếp (mới, giá, phổ biến)

### Product Detail
- 🖼️ Hình ảnh sản phẩm
- ⭐ Rating & reviews
- 📝 Mô tả chi tiết
- 🛒 Thêm vào giỏ hàng
- ❤️ Thêm vào wishlist

### Shopping Cart
- 📦 Xem sách trong giỏ
- ➕➖ Thay đổi số lượng
- 🗑️ Xóa sách
- 💰 Tính tổng tiền
- 💾 Lưu persistent (localStorage)

### Checkout
- 📝 Nhập thông tin giao hàng
- 💳 Chọn phương thức thanh toán (COD, Bank Transfer)
- ✅ Xác nhận đơn hàng

### Account
- 👤 Thông tin cá nhân
- 📦 Quản lý đơn hàng
- ❤️ Danh sách wishlist
- 📍 Quản lý địa chỉ giao hàng

### Additional Pages
- About - Thông tin công ty
- Contact - Liên hệ & feedback
- Search - Tìm kiếm sách
- Order Success - Xác nhận đơn hàng

## 🎨 Design Features

- 📱 Responsive Design (Mobile-first)
- 🎯 Modern UI/UX
- 🌈 Pink & Orange Color Scheme
- ✨ Smooth Transitions & Animations
- 💫 Interactive Elements

## 🔧 Công nghệ sử dụng

### Frontend
- React 19.2.4
- React Router DOM 7.13.2
- Tailwind CSS 4.2.2

### Utilities
- Axios 1.14.0
- Lucide React 1.7.0
- React Icons 5.6.0
- Framer Motion 12.38.0
- React Toastify 11.0.5
- Swiper 11.1.14

### Dev Tools
- Vite 8.0.1
- ESLint 9.39.4
- PostCSS 8.5.8
- Autoprefixer 10.4.27

## 🚀 Cách sử dụng

### 1. Cài đặt
```bash
cd frontend-user
npm install
```

### 2. Chạy development
```bash
npm run dev
```
Truy cập: http://localhost:5174

### 3. Build production
```bash
npm run build
```

### 4. Lint code
```bash
npm run lint
```

## 🔗 Liên kết với hệ thống

### Admin Frontend (frontend-admin)
- Cùng một stack: React + Vite + Tailwind
- Quản lý sách, danh mục, đơn hàng

### Backend API
- Kết nối qua Axios interceptor
- Tự động gửi JWT token
- API base: `http://localhost:3000/api`

## 📊 Data Flow

```
User Frontend (Port 5174)
    ↓
Axios API Client
    ↓
Backend API (Port 3000)
    ↓
Database
    ↓
Admin Frontend (Port 5173)
```

## 🌟 Điểm nổi bật

✅ **Hoàn chỉnh**: Tất cả trang cần thiết cho e-commerce  
✅ **Responsive**: Hoạt động tốt trên mobile/tablet/desktop  
✅ **Modern**: Sử dụng React 19 và Vite mới nhất  
✅ **Styled**: Tailwind CSS + Custom theming  
✅ **State Management**: Context API cho cart  
✅ **API Ready**: Axios interceptor sẵn sàng  
✅ **Production Ready**: Build scripts & config  
✅ **Well Documented**: README + Quick Start  

## 📝 Lưu ý

- Dữ liệu hiện tại là mock data
- Thế bằng API calls từ backend
- CartContext lưu data trong localStorage
- Hỗ trợ authentication với JWT tokens
- CORS proxy đã cấu hình trong vite.config.js

## 🎓 Tài liệu

- `README.md` - Mô tả dự án
- `QUICKSTART.md` - Hướng dẫn bắt đầu nhanh
- `INTEGRATION_GUIDE.md` (root) - Tích hợp hệ thống toàn bộ

## 👥 Team

Nhóm 8 - Dự án e-commerce sách STU Book

---

**Status**: ✅ Hoàn thành  
**Last Updated**: 2024-01-15  
**Version**: 1.0.0
