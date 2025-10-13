import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth-provider";
import HomePage from "./pages/Home";
import AuthPage from "./pages/Auth";
import NotFoundPage from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import AboutUsPage from "./pages/About";
import BlogPage from "./pages/Blog";
import CareerPage from "./pages/Career";
import PressPage from "./pages/Press";
import PrivacyPage from "./pages/Privacy";
import TermPage from "./pages/Terms";
import HelpPage from "./pages/Help";
import ContactPage from "./pages/Contact";
import TradePage from "./pages/Trade";
import SellPage from "./pages/Sell";
import ListingPage from "./pages/Listing";
import SellersPage from "./pages/Sellers";
import OrdersPage from "./pages/Orders";
import CategoriesPage from "./pages/Categories";
import SettingsPage from "./pages/Settings";
import InboxPage from "./pages/Inbox";
import NotificationsPage from "./pages/Notifications";
import ProductPage from "./pages/Product";
import SellerPage from "./pages/Seller";
import OrderHistory from "./pages/OrderHistory"; // Assuming this is already imported
import type { JSX } from "react";

// Protected Route Component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <SellPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <InboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Public Routes */}
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/careers" element={<CareerPage />} />
      <Route path="/press" element={<PressPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/trade" element={<TradePage />} />
      <Route path="/listings" element={<ListingPage />} />
      <Route path="/sellers" element={<SellersPage />} />
      <Route path="/categories" element={<CategoriesPage />} />

      {/* Dynamic product route - public */}
      <Route path="/product/:id" element={<ProductPage />} />

      {/* Dynamic seller route - public */}
      <Route path="/seller/:id" element={<SellerPage />} />

      {/* Protected Dashboard orders routes */}
      <Route
        path="/dashboard/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orders/history"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />

      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
