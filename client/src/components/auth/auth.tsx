import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "../ui/tabs";
import Login from "./login";
import Register from "./register";

function Auth() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="register">
        <TabsList>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <Register />
        </TabsContent>
        <TabsContent value="login">
          <Login />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;
