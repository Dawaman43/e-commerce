import { useAuth } from "@/components/auth-provider";
import Auth from "@/components/auth/auth";
import ActiveOrders from "@/components/dashboard/activeOrders";
import Hero from "@/components/dashboard/hero";
import NewProduct from "@/components/dashboard/newProduct";
import RecentOrders from "@/components/dashboard/recentOrders";
import TopSellers from "@/components/dashboard/topSellers";
import NewsletterSignup from "@/components/layout/newsletter";

function HomePage() {
  const { user, loading } = useAuth(); // Make sure your provider returns `loading`

  if (loading) {
    // Optional: show spinner or skeleton while session is loading
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-y-8">
      <Hero />
      <NewProduct />
      <TopSellers />
      <ActiveOrders />
      <RecentOrders />
      <NewsletterSignup />
    </div>
  );
}

export default HomePage;
