import { useAuth } from "@/components/auth-provider";
import Auth from "@/components/auth/auth";

function HomePage() {
  const { user } = useAuth();

  const noUserFound = !user;
  return (
    <>
      <div>Homepage</div>

      {noUserFound && <Auth />}
    </>
  );
}

export default HomePage;
