import { 
  LayoutDashboard, BookOpen, List, ShoppingCart, 
  Users, Warehouse, BarChart3, Star, CreditCard, Package
} from 'lucide-react';

export const ADMIN_MENU = [
  { id: 1, label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { id: 2, label: 'Danh mục', path: '/categories', icon: List },
  { id: 3, label: 'Sách', path: '/books', icon: BookOpen },
  { id: 4, label: 'Đơn hàng', path: '/orders', icon: ShoppingCart },
  { id: 5, label: 'Khách hàng', path: '/customers', icon: Users },
  { id: 6, label: 'Kho hàng', path: '/inventory', icon: Warehouse },
  { id: 7, label: 'Đánh giá sách', path: '/ratings', icon: Star },
  { id: 8, label: 'Thanh toán', path: '/payments', icon: CreditCard },
  { id: 9, label: 'Giỏ hàng', path: '/carts', icon: Package },
  { id: 10, label: 'Thống kê', path: '/reports', icon: BarChart3 },
];