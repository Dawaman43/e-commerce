import ActiveOrders from "@/components/dashboard/activeOrders";
import Hero from "@/components/dashboard/hero";
import NewProduct from "@/components/dashboard/newProduct";
import RecentOrders from "@/components/dashboard/recentOrders";
import TopSellers from "@/components/dashboard/topSellers";

function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <NewProduct />
      <TopSellers />
      <ActiveOrders />
      <RecentOrders />
    </div>
  );
}

export default DashboardPage;
