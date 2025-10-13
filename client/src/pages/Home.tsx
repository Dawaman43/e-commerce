import { useAuth } from "@/components/auth-provider";
import Auth from "@/components/auth/auth";
import ActiveOrders from "@/components/dashboard/activeOrders";
import Hero from "@/components/dashboard/hero";
import NewProduct from "@/components/dashboard/newProduct";
import RecentOrders from "@/components/dashboard/recentOrders";
import TopSellers from "@/components/dashboard/topSellers";
import NewsletterSignup from "@/components/layout/newsletter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function HomePage() {
  const { user, loading } = useAuth(); // Make sure your provider returns `loading`

  if (loading) {
    // Improved spinner with better styling and accessibility
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
            role="status"
            aria-label="Loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      {/* Enhanced Hero with motion - always show */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full"
      >
        <Hero />
      </motion.section>

      {/* Main Content Grid for better layout - added overflow-visible and adjusted spacing */}
      <main className="container mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16 overflow-visible">
        {/* Quick Actions Row - Single column - only for logged in */}
        {isLoggedIn && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-6 w-full"
          >
            <div className="bg-card rounded-lg p-6 shadow-md border border-border hover:shadow-lg transition-shadow overflow-visible">
              <NewProduct />
            </div>
            {/* Stats as full-width single column */}
            <div className="bg-card rounded-lg p-6 shadow-md border border-border overflow-visible">
              <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-1 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">
                    Active Listings
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">5</p>
                  <p className="text-sm text-muted-foreground">
                    Pending Orders
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">$450</p>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Sellers and Orders Sections - Single column */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 gap-8 w-full overflow-visible"
        >
          <TopSellers />
          {isLoggedIn ? (
            <ActiveOrders />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-lg p-8 shadow-md border border-border overflow-visible text-center"
            >
              <CardHeader>
                <CardTitle className="text-xl mb-2">
                  Sign In for Your Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Log in to view your active orders and track your trades.
                </p>
                <Button asChild className="w-full">
                  <a href="/auth">Sign In</a>
                </Button>
              </CardContent>
            </motion.div>
          )}
        </motion.section>

        {/* Recent Orders - only for logged in */}
        {isLoggedIn && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full overflow-visible"
          >
            <RecentOrders />
          </motion.section>
        )}

        {/* Newsletter at bottom with better placement - always show */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-12 border-t border-border w-full overflow-visible"
        >
          <NewsletterSignup />
        </motion.footer>
      </main>
    </div>
  );
}

export default HomePage;
