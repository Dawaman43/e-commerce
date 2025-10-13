import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { motion } from "framer-motion";
import Login from "./login";
import Register from "./register";

const tabVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

function Auth() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <div className="mx-auto h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-background">E</span>{" "}
              {/* Placeholder for logo */}
            </div>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Please sign in to your account or create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="register"
                  className="rounded-none rounded-l-lg data-[state=active]:rounded-r-none"
                >
                  Register
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  className="rounded-none rounded-r-lg data-[state=active]:rounded-l-none"
                >
                  Login
                </TabsTrigger>
              </TabsList>
              <motion.div
                key="register"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={tabVariants}
              >
                <TabsContent value="register" className="mt-6">
                  <Register />
                </TabsContent>
              </motion.div>
              <motion.div
                key="login"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={tabVariants}
              >
                <TabsContent value="login" className="mt-6">
                  <Login />
                </TabsContent>
              </motion.div>
            </Tabs>
            <div className="text-center text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Auth;
