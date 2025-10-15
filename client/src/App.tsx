import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/auth-provider";
import type { JSX } from "react";

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
import UsersPage from "./pages/Users";
import ModeratorDashboard from "./pages/ModeratorDashboard";

// ✅ Protected Route - waits for auth loading before redirecting
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

// ✅ Role-based Route - only allows certain roles
function RoleRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role || "")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// ✅ Auth Route - redirects logged-in users away from /auth
function AuthRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
}

// ✅ Home Route Wrapper - redirects admin/moderator to dashboards
function HomeWrapper({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return children; // Public access for unauthenticated users

  const role = user.role || "user";
  if (role === "moderator")
    return <Navigate to="/moderator/dashboard" replace />;
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return children; // normal user -> home
}

// ✅ Main App Routes
const App = () => {
  const { loading } = useAuth();

  // Optional: global loading screen during initial auth check
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Home */}
      <Route
        path="/"
        element={
          <HomeWrapper>
            <HomePage />
          </HomeWrapper>
        }
      />

      {/* Authentication */}
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        }
      />

      {/* User Protected Routes */}
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

      {/* Admin Routes */}
      <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Moderator Routes */}
      <Route
        path="/moderator"
        element={<RoleRoute allowedRoles={["moderator"]} />}
      >
        <Route path="dashboard" element={<ModeratorDashboard />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

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

      {/* Public Dynamic Pages */}
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/seller/:id" element={<SellerPage />} />

      {/* 404 Page */}
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
