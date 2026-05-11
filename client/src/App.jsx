import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/common/Layout';
import AdminLayout from './admin/AdminLayout';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';

// Customer pages — eagerly loaded (small, above-the-fold, or auth-critical)
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// BUG C-12 FIX: lazily loaded customer pages — not needed on first paint
const ShopPage             = lazy(() => import('./pages/ShopPage'));
const CategoryPage         = lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage    = lazy(() => import('./pages/ProductDetailPage'));
const CartPage             = lazy(() => import('./pages/CartPage'));
const CheckoutPage         = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const SearchPage           = lazy(() => import('./pages/SearchPage'));
const AboutPage            = lazy(() => import('./pages/AboutPage'));

// Admin pages — all lazy; never needed by customer bundle
const AdminLogin           = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard       = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProducts        = lazy(() => import('./admin/pages/AdminProducts'));
const AdminProductForm     = lazy(() => import('./admin/pages/AdminProductForm'));
const AdminCategories      = lazy(() => import('./admin/pages/AdminCategories'));
const AdminOrders          = lazy(() => import('./admin/pages/AdminOrders'));
const AdminOrderDetail     = lazy(() => import('./admin/pages/AdminOrderDetail'));

// Minimal fallback — replace with a branded spinner if you have one
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: '#141414', color: '#fff', border: '1px solid #2A2A2A' } }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Customer routes */}
          <Route element={<Layout />}>
            <Route path="/"                         element={<HomePage />} />
            <Route path="/shop"                     element={<ShopPage />} />
            <Route path="/category/:slug"           element={<CategoryPage />} />
            <Route path="/product/:slug"            element={<ProductDetailPage />} />
            <Route path="/cart"                     element={<CartPage />} />
            <Route path="/checkout"                 element={<CheckoutPage />} />
            <Route path="/order-confirmation/:id"   element={<OrderConfirmationPage />} />
            <Route path="/search"                   element={<SearchPage />} />
            <Route path="/about"                    element={<AboutPage />} />
            <Route path="/login"                    element={<LoginPage />} />
            <Route path="/register"                 element={<RegisterPage />} />
            <Route path="*"                         element={<NotFoundPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
            <Route index                          element={<AdminDashboard />} />
            <Route path="products"                element={<AdminProducts />} />
            <Route path="products/new"            element={<AdminProductForm />} />
            <Route path="products/edit/:id"       element={<AdminProductForm />} />
            <Route path="categories"              element={<AdminCategories />} />
            <Route path="orders"                  element={<AdminOrders />} />
            <Route path="orders/:id"              element={<AdminOrderDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}