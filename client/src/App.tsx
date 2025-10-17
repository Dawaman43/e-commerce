import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/auth-provider";
import { isValidObjectId } from "@/api/order"; // Reuse validator for sellerId checks
import type { JSX } from "react";
import {
  Loader2, // For spinners (from lucide-react)
} from "lucide-react";
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
import EditProductPage from "./pages/EditProduct";
import CategoryProductsPage from "./pages/CategoryProducts";
import OrderDetailPage from "./pages/OrderDetail";
import AdminUserBanPage from "./pages/AdminUserBan";
import SearchResultPage from "./pages/SearchResult";
import CartPage from "./pages/Cart";
import OrderAcceptPage from "./pages/OrderAccept";

interface AppProps {
  className?: string;
}

// Key Change 1: Enhanced ProtectedRoute – adds valid ID check for extra safety.
// Waits for auth loading (session + token) before rendering/redirecting.
// Prevents any downstream fetches (e.g., in OrderAcceptPage) from running with invalid sellerId.
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user session...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.id || !isValidObjectId(user.id)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

// Role-based Route – minor UX tweak for loading.
function RoleRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user session...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.id || !isValidObjectId(user.id)) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role || "")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// Auth Route – enhanced loading.
function AuthRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user session...</p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
}

// Home Wrapper – enhanced with ID validation.
function HomeWrapper({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user session...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.id || !isValidObjectId(user.id)) {
    return children; // Public for unauth
  }

  const role = user.role || "user";
  if (role === "moderator")
    return <Navigate to="/moderator/dashboard" replace />;
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return children;
}

// Main App Routes
const App = ({ className }: AppProps) => {
  // Key Change 2: Destructure user/loading here if needed for global logic.
  const { user, loading } = useAuth();

  // Optional: Global fetch for shared pending orders (e.g., for nav badge).
  // Uncomment if this is where fetchPendingOrders lives – guarded like in OrderAcceptPage.
  // This prevents "Invalid seller ID" globally.
  /*
  useEffect(() => {
    const fetchPendingOrders = async () => {
      if (loading || !user?.id || !isValidObjectId(user.id)) {
        // Silently wait – no fetch until ready.
        return;
      }
      // Your fetch logic here...
    };
    fetchPendingOrders();
  }, [user?.id, loading]);
  */

  // Global loading – covers initial auth (BetterAuth + token).
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
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
          path="/edit-product"
          element={
            <ProtectedRoute>
              <EditProductPage />
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
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accept-order"
          element={
            <ProtectedRoute>
              <OrderAcceptPage />
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
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
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
          <Route path="users/ban" element={<AdminUserBanPage />} />
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
        <Route path="/categories/:id" element={<CategoryProductsPage />} />
        <Route path="/SearchResult/:id" element={<SearchResultPage />} />

        {/* 404 Page */}
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
