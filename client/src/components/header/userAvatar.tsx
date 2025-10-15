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
  Camera, // Added for edit avatar icon
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import AvatarPicker from "@/components/profile/AvatarPicker"; // Import AvatarPicker
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // For subtle animations
import type { AuthSession } from "@/types/auth"; // Import for type safety

interface UserAvatarProps {
  size?: "sm" | "md";
  showPicker?: boolean; // Optional prop to show inline picker trigger
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

function UserAvatar({ size = "md", showPicker = false }: UserAvatarProps) {
  const { user, loading, logout, updateUser } = useAuth(); // Assume updateUser is available for immediate local updates
  const [localAvatarUrl, setLocalAvatarUrl] = useState(""); // Initialize empty; will sync after user loads
  const [updating, setUpdating] = useState(false); // Local state for update feedback

  const avatarSize = size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-10 text-lg";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  // Sync local state with user prop changes (e.g., after API save) - only when user exists
  useEffect(() => {
    if (user && user.avatarUrl !== localAvatarUrl) {
      setLocalAvatarUrl(user.avatarUrl);
    }
  }, [user?.avatarUrl, localAvatarUrl]);

  if (loading) {
    return <Skeleton className={`${avatarSize} rounded-full`} />;
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to="/auth">Login</Link>
      </Button>
    );
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleAvatarChange = async (newUrl: string) => {
    const previousUrl = localAvatarUrl;
    setLocalAvatarUrl(newUrl); // Instant local update for preview
    setUpdating(true);

    try {
      // Persist to backend
      if (updateUser) {
        await updateUser({ avatarUrl: newUrl });
      }
      // On success, provider will refresh and sync via useEffect
    } catch (error) {
      console.error("🔴 [UserAvatar] Avatar update failed:", error);
      setLocalAvatarUrl(previousUrl); // Revert on error
      // Optionally: Show toast notification here
    } finally {
      setUpdating(false);
    }
  };

  const currentAvatarUrl = localAvatarUrl || user.avatarUrl || user.picture; // Fallback to picture if avatarUrl empty

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt={`${user.name}'s avatar`}
                className={`${avatarSize} rounded-full object-cover cursor-pointer border border-gray-200 dark:border-gray-700 transition-shadow duration-200 hover:shadow-md`}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  setLocalAvatarUrl(""); // Fallback to initials on error
                }}
              />
            ) : (
              <motion.div
                className={`${avatarSize} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold cursor-pointer border border-gray-200 dark:border-gray-700 flex-shrink-0 transition-shadow duration-200 hover:shadow-md`}
                aria-label={`Avatar for ${user.name}`}
                whileHover={{ scale: 1.02 }}
              >
                {getInitials(user.name || "User")}
              </motion.div>
            )}
            {showPicker && (
              <motion.button
                type="button"
                className="absolute -bottom-1 -right-1 p-1 bg-primary text-primary-foreground rounded-full border-2 border-background shadow-lg"
                onClick={(e) => e.stopPropagation()} // Prevent dropdown trigger
                disabled={updating}
                whileHover={updating ? {} : { scale: 1.1 }}
                whileTap={updating ? {} : { scale: 0.95 }}
                title={updating ? "Updating..." : "Edit Avatar"}
              >
                {updating ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className={iconSize} />
                )}
              </motion.button>
            )}
          </motion.div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {showPicker ? (
            <DropdownMenuItem className="p-0" disabled={updating}>
              <AvatarPicker
                value={currentAvatarUrl}
                onChange={handleAvatarChange}
                defaultSeed={user.name}
              />
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-x-2 w-full">
                <Pencil className={iconSize} /> Edit Profile
              </Link>
            </DropdownMenuItem>
          )}
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
    </>
  );
}

export default UserAvatar;
