import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/utils/auth";

function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-[360px] shadow-lg border border-border/50">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Sign In to Continue
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email and password fields could go here if needed */}

          <Separator />

          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full flex items-center gap-2 hover:bg-muted/50 transition"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default Register;
