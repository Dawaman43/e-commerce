import { Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/*" element={<NotFoundPage />} />

      {/* new routes */}
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/careers" element={<CareerPage />} />
      <Route path="/press" element={<PressPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/trade" element={<TradePage />} />
      <Route path="/sell" element={<SellPage />} />
      <Route path="/listings" element={<ListingPage />} />
      <Route path="/sellers" element={<SellersPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
};

export default App;
