import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-w-full min-h-screen flex justify-center items-center gap-4  flex-col">
      <h1 className="text-6xl font-bold mb-8">404</h1>
      <div className="text-xl text-center">
        <p>The route you looking for not found</p>
        <p>
          please return to previous page or use the below button to go to
          homepage
        </p>
      </div>
      <Button>
        <Link to="/">Go to homepage</Link>
      </Button>
    </div>
  );
}

export default NotFoundPage;
