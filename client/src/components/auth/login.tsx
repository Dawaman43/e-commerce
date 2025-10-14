import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { motion } from "framer-motion";
import { signInWithGoogle } from "@/utils/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import { login } from "@/api/auth"; // Adjust path as needed
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth-provider"; // 🔹 ADD: Import useAuth

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type FormData = z.infer<typeof formSchema>;

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

function Login() {
  const navigate = useNavigate();
  const { refreshSession } = useAuth(); // 🔹 ADD: Destructure refreshSession
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔹 ADD: Prevent double-submit
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    if (isSubmitting) return; // 🔹 ADD: Debounce
    setIsSubmitting(true);
    console.log("🟢 [Login.tsx] Form submitted with:", values);

    try {
      const data = await login(values.email, values.password);
      console.log("🟢 [Login.tsx] Login API returned:", data);

      const user = data.user;
      const token = data.generateToken;

      // ✅ Store token in localStorage
      localStorage.setItem("token", token);
      console.log("🟢 [Login.tsx] Token stored");

      // 🔹 FIX: Refresh auth state to sync user globally
      console.log("🔍 [Login.tsx] Calling refreshSession");
      await refreshSession();
      console.log(
        "🟢 [Login.tsx] refreshSession complete - check AuthProvider logs"
      );

      // 🔹 FIX: Remove invalid useAuth() here. Log from API response instead
      console.log("🔍 [Login.tsx] API user (pre-state sync):", {
        id: user.id,
        role: user.role,
      });

      toast.success(data.message || "Logged in successfully.");

      // Role-based redirect (now user state is synced)
      let redirectPath = "/dashboard";
      if (user.role === "admin") redirectPath = "/admin/dashboard";
      else if (user.role === "moderator") redirectPath = "/moderator/dashboard";
      else redirectPath = "/";

      console.log(
        "🟢 [Login.tsx] Role:",
        user.role,
        "Redirecting to:",
        redirectPath
      );

      // 🔹 ADD: setTimeout for any microtask settling (e.g., state re-render)
      setTimeout(() => {
        console.log("🚀 [Login.tsx] Executing navigate");
        navigate(redirectPath, { replace: true }); // replace avoids back-button issues
      }, 0);
    } catch (error: any) {
      console.error("🔴 [Login.tsx] Login error:", error);
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false); // 🔹 ADD: Reset submit state
    }
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="your password"
                        {...field}
                        className="pr-10"
                        disabled={isSubmitting} // 🔹 ADD: Disable during submit
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting} // 🔹 ADD: Disable during submit
                      >
                        {showPassword ? (
                          <HiEyeOff className="h-4 w-4" />
                        ) : (
                          <HiEye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || form.formState.isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}{" "}
              {/* 🔹 ADD: Loading text */}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full h-12 flex items-center gap-3 py-7 border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-xl text-foreground hover:text-primary"
            disabled={isSubmitting} // 🔹 ADD: Disable during submit
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </Button>
        </motion.div>
      </CardContent>
    </motion.div>
  );
}

export default Login;
