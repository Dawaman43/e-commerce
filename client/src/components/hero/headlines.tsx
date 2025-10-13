import { getCurrentUser } from "@/api/user";
import type { User } from "@/types/user";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Headlines() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
          Hey {user?.name ?? "there"}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-muted-foreground text-lg md:text-xl font-medium text-center max-w-md"
        >
          Discover seamless e-commerce solutions tailored for your business.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Headlines;
