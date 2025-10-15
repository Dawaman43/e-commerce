import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/header/header.tsx";
import { AuthProvider } from "./components/auth-provider.tsx";
import { Toaster } from "sonner";
import Footer from "./components/layout/footer.tsx";
import Sidebar from "./components/layout/sidebar.tsx";
import { useState } from "react";
import { cn } from "./lib/utils.ts";

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const sidebarWidthClass = isCollapsed ? "ml-20" : "ml-64";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          className="hidden md:block"
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
        />
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out md:" +
              sidebarWidthClass,
            "hidden md:block" // Ensure main adjusts only on md+ where sidebar is visible
          )}
        >
          <App />
          <Footer />
        </main>
        {/* For mobile, show full width without margin */}
        <main className="flex-1 md:hidden">
          <App />
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster richColors position="top-right" />
          <Layout />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
