import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/Auth/Login';

// Admin Pages
import Dashboard from './pages/Dashboard/Dashboard';
import BookList from './pages/Book/BookList';
import CategoryList from './pages/Category/CategoryList';
import OrderList from './pages/Order/OrderList';
import CustomerList from './pages/Customer/CustomerList';
import InventoryList from './pages/Inventory/InventoryList';
import Report from './pages/Report/Report';
import RatingList from './pages/Rating/RatingList';
import PaymentList from './pages/Payment/PaymentList';
import CartList from './pages/Cart/CartList';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const adminRole = localStorage.getItem('adminRole');
  
  console.log('🔐 ProtectedRoute check:', { userId, token, adminRole });
  
  // Accept both 'admin' and 'quan_tri' roles
  if (!userId || !token || (adminRole !== 'admin' && adminRole !== 'quan_tri')) {
    console.error('❌ ProtectedRoute BLOCKED:', { userId, token, adminRole });
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ ProtectedRoute PASSED');
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="books" element={<BookList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="ratings" element={<RatingList />} />
          <Route path="payments" element={<PaymentList />} />
          <Route path="carts" element={<CartList />} />
          <Route path="reports" element={<Report />} />
        </Route>
        
        {/* Redirect unknown routes to dashboard or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;