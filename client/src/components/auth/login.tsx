import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { signInWithGoogle } from "@/utils/auth";

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

function Login() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-foreground">
          Sign In
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full h-12 flex items-center gap-3 py-7 border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-xl text-foreground hover:text-primary"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </Button>
        </motion.div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </CardContent>
    </motion.div>
  );
}

export default Login;
