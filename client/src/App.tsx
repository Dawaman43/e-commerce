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
import OrderHistory from "./pages/OrderHistory";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import type { JSX } from "react";

// Protected Route Component - requires authentication
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

// Role-based Route Component - requires specific role
function RoleRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (!allowedRoles.includes(user.role || ""))
    return <Navigate to="/" replace />;
  return children;
}

// Auth Route Component - redirects if already authenticated
function AuthRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

// Home Route Wrapper - role-based redirect for authenticated users
function HomeWrapper({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return children; // Public access for unauthenticated

  const role = user.role || "user";
  if (role === "moderator")
    return <Navigate to="/moderator/dashboard" replace />;
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return children; // Show home for "user" role
}

const App = () => {
  return (
    <Routes>
      {/* Home Route - public for unauth, user-role only for auth */}
      <Route
        path="/"
        element={
          <HomeWrapper>
            <HomePage />
          </HomeWrapper>
        }
      />

      {/* Auth Route - protected from logged-in users */}
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        }
      />

      {/* Protected Routes - require login (user-level) */}
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

      {/* Role-Protected Dashboards */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/moderator/dashboard"
        element={
          <RoleRoute allowedRoles={["moderator"]}>
            <ModeratorDashboard />
          </RoleRoute>
        }
      />

      {/* Public Static Pages */}
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

      {/* Public Dynamic Routes */}
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/seller/:id" element={<SellerPage />} />

      {/* Catch-all for 404 */}
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
