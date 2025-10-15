// AdminDashboard.tsx - Updated without header and AdminSidebar
import { useState } from "react";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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

// Mock Data for P2P Marketplace
const mockStats = [
  {
    title: "Total Users",
    value: "12,234",
    change: "+12%",
    icon: Users,
    color: "text-emerald-600",
  },
  {
    title: "Active Listings",
    value: "5,678",
    change: "+8%",
    icon: ShoppingBag,
    color: "text-blue-600",
  },
  {
    title: "Total Transactions",
    value: "2,456",
    change: "+15%",
    icon: Handshake,
    color: "text-purple-600",
  },
  {
    title: "Platform Revenue",
    value: "$9,876",
    change: "+3%",
    icon: DollarSign,
    color: "text-amber-600",
  },
];

const mockRecentTransactions = [
  {
    id: "#TXN001",
    seller: "John Doe",
    buyer: "Jane Smith",
    item: "Vintage Watch",
    amount: "$299.99",
    status: "Completed",
    date: "2025-10-14",
  },
  {
    id: "#TXN002",
    seller: "Bob Johnson",
    buyer: "Alice Brown",
    item: "Handmade Leather Bag",
    amount: "$149.50",
    status: "In Dispute",
    date: "2025-10-13",
  },
  {
    id: "#TXN003",
    seller: "Charlie Wilson",
    buyer: "Eva Davis",
    item: "Custom Sneakers",
    amount: "$89.99",
    status: "Payment Received",
    date: "2025-10-12",
  },
  {
    id: "#TXN004",
    seller: "Mia Green",
    buyer: "Liam White",
    item: "Art Print",
    amount: "$199.00",
    status: "Cancelled",
    date: "2025-10-11",
  },
  {
    id: "#TXN005",
    seller: "Noah Lee",
    buyer: "Olivia Taylor",
    item: "Guitar",
    amount: "$349.75",
    status: "Completed",
    date: "2025-10-10",
  },
];

const mockChartData = [
  { month: "Jan", listings: 1200, transactions: 800 },
  { month: "Feb", listings: 1500, transactions: 950 },
  { month: "Mar", listings: 1800, transactions: 1100 },
  { month: "Apr", listings: 2000, transactions: 1300 },
  { month: "May", listings: 2200, transactions: 1400 },
  { month: "Jun", listings: 2500, transactions: 1600 },
  { month: "Jul", listings: 2800, transactions: 1800 },
];

const statusColors = {
  Completed: "bg-green-100 text-green-800",
  "In Dispute": "bg-yellow-100 text-yellow-800",
  "Payment Received": "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-100 text-red-800",
};

function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = mockRecentTransactions.filter(
    (transaction) =>
      transaction.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartConfig = {
    listings: { label: "New Listings", color: "hsl(var(--primary))" },
    transactions: { label: "Transactions", color: "hsl(var(--destructive))" },
  } satisfies ChartConfig;

  return (
    <>
      {/* Main Content - Offset for fixed sidebar */}
      <div className="flex h-screen bg-background ml-64">
        {/* Body */}
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Search Input - Moved from header */}
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search users, listings, or transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStats.map((stat, index) => {
              const Icon = stat.icon;
              const isPositive = stat.change.startsWith("+");
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator />

          {/* Charts and Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Listings & Transactions Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Marketplace Activity</CardTitle>
                <CardDescription>
                  New listings and transactions over time.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[250px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockChartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
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
                <CardTitle>Active Disputes</CardTitle>
                <CardDescription>Resolve user issues promptly.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted"
                    >
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none">
                          {dispute.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dispute.parties}
                        </p>
                        <p className="text-xs text-muted-foreground">
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

          {/* Recent Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent P2P Transactions</CardTitle>
              <CardDescription>Latest peer-to-peer deals.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{transaction.seller}</TableCell>
                      <TableCell>{transaction.buyer}</TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {transaction.item}
                      </TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>
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
                      <TableCell>{transaction.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}

// Helper component for chart legend
const ChartLegend = ({ payload }: { payload?: any[] }) => {
  if (!payload) return null;
  return (
    <ul className="flex space-x-4 text-xs">
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

export default AdminDashboard;
