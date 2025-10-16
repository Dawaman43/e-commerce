import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { easeOut, motion } from "framer-motion";
import { signInWithGoogle } from "@/utils/auth";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-muted/30 to-background px-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        <Card className="w-full shadow-xl border border-border/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 py-8">
            <CardTitle className="text-center text-2xl font-bold text-foreground mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Sign in to your account to continue exploring amazing deals.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="relative">
              <Separator className="my-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-3 text-xs text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                className="w-full flex items-center gap-3 py-7 border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-xl text-foreground hover:text-primary"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Register;
