import { useEffect, useState } from "react";
import { getCurrentUser } from "@/api/user";
import type { User } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Pencil, Settings, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { signOut } from "@/utils/auth";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

function UserAvatar() {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.user);
      } catch (err) {
        console.error("[UserAvatar] Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (!user)
    return (
      <Button asChild>
        <Link to="/auth">Login</Link>
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-lg cursor-pointer">
            {getInitials(user.name)}
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-x-2">
            <UserIcon className="w-5 h-5" /> Profile
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-x-2">
            <Pencil className="w-5 h-5" /> Edit Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-x-2">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 font-bold flex items-center justify-center"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserAvatar;
