import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Inbox,
  LogOut,
  MessageSquareIcon,
  Pencil,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton"; // Assuming shadcn/ui Skeleton for loading

interface UserAvatarProps {
  size?: "sm" | "md";
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2); // Limit to 2 initials for better fit

function UserAvatar({ size = "md" }: UserAvatarProps) {
  const { user, loading, logout } = useAuth(); // Assuming useAuth provides isLoading for auth state

  const avatarSize = size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-10 text-lg";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  if (loading) {
    return <Skeleton className={`${avatarSize} rounded-full`} />;
  }

  if (!user) {
    return (
      <Button variant="outline" size={"sm"} asChild>
        <Link to="/auth">Login</Link>
      </Button>
    );
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s avatar`}
            className={`${avatarSize} rounded-full object-cover cursor-pointer border border-gray-200 dark:border-gray-700`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none"; // Hide broken image
            }}
          />
        ) : (
          <div
            className={`${avatarSize} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold cursor-pointer border border-gray-200 dark:border-gray-700 flex-shrink-0`}
            aria-label={`Avatar for ${user.name}`}
          >
            {getInitials(user.name || "User")}
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-x-2 w-full">
            <Pencil className={iconSize} /> Edit Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/inbox" className="flex items-center gap-x-2 w-full">
            <Inbox className={iconSize} /> Inbox
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/notifications"
            className="flex items-center gap-x-2 w-full"
          >
            <MessageSquareIcon className={iconSize} /> Notifications
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-x-2 w-full">
            <Settings className={iconSize} /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-x-2 text-destructive focus:text-destructive"
        >
          <LogOut className={iconSize} /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserAvatar;
