src/
├── assets/             # Hình ảnh, icons, fonts, file CSS global
├── components/         # Các thành phần giao diện có thể tái sử dụng
│   ├── common/         # Button, Input, Modal, Loading, Table chuẩn
│   ├── layout/         # Header, Footer, Sidebar, Breadcrumbs
│   └── shared/         # Các component dùng chung cho 2-3 trang
├── constants/          # Lưu hằng số: API_URL, STATUS_CODE, MENU_ITEMS
├── hooks/              # Các Custom Hooks (useAuth, useFetch, useDebounce)
├── layouts/            # Chứa các khung giao diện chính (AdminLayout, AuthLayout)
├── pages/              # Mỗi folder là một tính năng lớn (chứa UI chính của trang đó)
│   ├── Dashboard/
│   ├── Category/
│   ├── Book/
│   ├── Order/
│   ├── Customer/
│   ├── Inventory/      # Quản lý kho
│   └── Report/         # Báo cáo & Thống kê
├── routes/             # Cấu hình định tuyến (AppRoutes.jsx)
├── services/           # Quản lý API calls (Axios instances, API endpoints)
├── store/              # Quản lý State toàn cục (Redux Toolkit hoặc Zustand)
├── utils/              # Các hàm bổ trợ: format tiền tệ, format ngày tháng
└── App.jsx             # File root component 