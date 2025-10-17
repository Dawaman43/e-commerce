import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Handshake,
  DollarSign,
  AlertTriangle,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getProducts } from "@/api/product";
import { getOrders } from "@/api/order";
import { getUsers } from "@/api/admin";
import type { ProductsResponse } from "@/types/product";
import type { OrdersResponse } from "@/types/order";
import type { GetUsersResponse } from "@/types/admin";
import { Button } from "@/components/ui/button";

// Helper component for chart legend
const ChartLegend = ({ payload }: { payload?: any[] }) => {
  if (!payload) return null;
  return (
    <ul className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4 text-xs">
      {payload.map((entry, index) => (
        <li
          key={`legend-${index}`}
          className="capitalize flex items-center space-x-1"
        >
          <div className={`w-3 h-3 rounded-sm ${entry.color}`} />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

type ChartConfig = {
  [label: string]: {
    label?: string;
    color?: string;
  };
};

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeListings: 0,
    totalTransactions: 0,
    platformRevenue: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users
        const usersResponse: GetUsersResponse = await getUsers();
        const totalUsers = usersResponse.users?.length || 0;

        // Fetch products for active listings (assume all products are active)
        const productsResponse: ProductsResponse = await getProducts();
        const activeListings = productsResponse.products?.length || 0;

        // Fetch orders for transactions and revenue
        const ordersResponse: OrdersResponse = await getOrders();
        const totalTransactions = ordersResponse.orders?.length || 0;
        const completedOrders =
          ordersResponse.orders?.filter(
            (order) => order.status === "completed"
          ) || [];
        const platformRevenue = completedOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        // Set stats
        setStats({
          totalUsers,
          activeListings,
          totalTransactions,
          platformRevenue,
        });

        // Recent transactions (last 5 completed or recent orders)
        const recent =
          ordersResponse.orders
            ?.filter((order) => order.createdAt)
            ?.sort(
              (a, b) =>
                new Date(b.createdAt!).getTime() -
                new Date(a.createdAt!).getTime()
            )
            ?.slice(0, 5)
            ?.map((order) => ({
              id: `#${order._id.slice(-6)}`,
              seller:
                typeof order.seller === "string"
                  ? order.seller
                  : order.seller.name || "Unknown Seller",
              buyer:
                typeof order.buyer === "string"
                  ? order.buyer
                  : order.buyer.name || "Unknown Buyer",
              item:
                typeof order.product === "string"
                  ? order.product
                  : order.product.name,
              amount: `$${order.totalAmount.toFixed(2)}`,
              status: order.status,
              date: new Date(order.createdAt!).toLocaleDateString(),
            })) || [];

        setRecentTransactions(recent);

        // Chart data - group orders and products by month (simplified for last 7 months)
        const now = new Date();
        const months = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push(date.toLocaleString("default", { month: "short" }));
        }

        const monthlyListings = months.map((month) => ({
          month,
          listings:
            productsResponse.products?.filter(
              (p) =>
                p.createdAt &&
                new Date(p.createdAt).toLocaleString("default", {
                  month: "short",
                }) === month
            )?.length || 0,
          transactions:
            ordersResponse.orders?.filter(
              (o) =>
                o.createdAt &&
                new Date(o.createdAt).toLocaleString("default", {
                  month: "short",
                }) === month
            )?.length || 0,
        }));

        setChartData(monthlyListings);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTransactions = recentTransactions.filter(
    (transaction) =>
      transaction.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartConfig: ChartConfig = {
    listings: { label: "New Listings", color: "hsl(var(--primary))" },
    transactions: { label: "Transactions", color: "hsl(var(--destructive))" },
  };

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    payment_sent: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content - Responsive offset for fixed sidebar */}
      <div className="flex min-h-screen bg-background md:ml-64">
        {/* Body */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Search Input - Responsive width */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Input
              placeholder="Search users, listings, or transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
          </div>

          {/* Stats Cards - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Active users</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Active Listings
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">
                  {stats.activeListings}
                </div>
                <p className="text-xs text-muted-foreground">Live products</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Total Transactions
                </CardTitle>
                <Handshake className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">
                  {stats.totalTransactions}
                </div>
                <p className="text-xs text-muted-foreground">All orders</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Platform Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">
                  ${stats.platformRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From completed sales
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Charts and Reports - Responsive grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Listings & Transactions Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Marketplace Activity
                </CardTitle>
                <CardDescription>
                  New listings and transactions over time.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={chartConfig}
                  className="h-[200px] sm:h-[250px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend content={<ChartLegend />} />
                      <Bar
                        dataKey="listings"
                        fill="var(--color-listings)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="transactions"
                        fill="var(--color-transactions)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Active Disputes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Active Disputes
                </CardTitle>
                <CardDescription>Resolve user issues promptly.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      id: "#DSP001",
                      parties: "John vs Jane",
                      issue: "Item not as described",
                      time: "2 hrs ago",
                    },
                    {
                      id: "#DSP002",
                      parties: "Bob vs Alice",
                      issue: "Payment delay",
                      time: "1 day ago",
                    },
                    {
                      id: "#DSP003",
                      parties: "Charlie vs Eva",
                      issue: "Shipping problem",
                      time: "3 days ago",
                    },
                  ].map((dispute, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted"
                    >
                      <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium leading-tight">
                          {dispute.id}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {dispute.parties}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {dispute.issue}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dispute.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Recent Transactions Table - Responsive with horizontal scroll */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Recent P2P Transactions
              </CardTitle>
              <CardDescription>Latest peer-to-peer deals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead className="w-[100px] sm:w-auto">
                        Seller
                      </TableHead>
                      <TableHead className="w-[100px] sm:w-auto">
                        Buyer
                      </TableHead>
                      <TableHead className="w-[120px] sm:w-[150px]">
                        Item
                      </TableHead>
                      <TableHead className="w-[90px]">Amount</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[90px]">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium w-[80px]">
                            {transaction.id}
                          </TableCell>
                          <TableCell className="w-[100px] sm:w-auto">
                            {transaction.seller}
                          </TableCell>
                          <TableCell className="w-[100px] sm:w-auto">
                            {transaction.buyer}
                          </TableCell>
                          <TableCell className="max-w-[120px] sm:max-w-[150px] truncate">
                            {transaction.item}
                          </TableCell>
                          <TableCell className="w-[90px]">
                            {transaction.amount}
                          </TableCell>
                          <TableCell className="w-[100px]">
                            <Badge
                              className={cn(
                                "text-xs",
                                statusColors[
                                  transaction.status as keyof typeof statusColors
                                ]
                              )}
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[90px]">
                            {transaction.date}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground py-8"
                        >
                          No recent transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;
