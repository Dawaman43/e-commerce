import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input as SearchInput } from "@/components/ui/input";
import { ChevronDown, ChevronUp, RefreshCw, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addUsers, getUsers, deleteUser, banUser, getUser } from "@/api/admin";
import type { AddUserRequest, User } from "@/types/admin";
import { cn } from "@/lib/utils";

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<AddUserRequest>({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    age: undefined,
    role: "user",
  });
  const [editUser, setEditUser] = useState<Partial<User>>({});

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "user" | "moderator" | "admin"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "banned" | "verified"
  >("all");

  // Pagination and sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortKey, setSortKey] = useState<keyof User>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [bulkSelection, setBulkSelection] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Bulk action states
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<"ban" | "delete" | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    searchTerm,
    roleFilter,
    statusFilter,
    sortKey,
    sortDirection,
  ]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const query: Record<string, any> = {
        page: currentPage,
        sortBy: sortKey,
        sortDir: sortDirection,
      };
      if (searchTerm) query.search = searchTerm;
      if (roleFilter !== "all") query.role = roleFilter;
      if (statusFilter !== "all") {
        if (statusFilter === "banned") query.isBanned = true;
        if (statusFilter === "active") query.isBanned = false;
        if (statusFilter === "verified") query.isVerified = true;
      }
      const response = await getUsers(query);
      setUsers(response.users || []);
      setTotalPages(response.totalPages || 1);
      setTotalUsers(response.totalUsers || 0);
      setBulkSelection(new Set());
      setSelectAll(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof User) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const toggleBulkSelect = (id: string, checked: boolean) => {
    const newSelection = new Set(bulkSelection);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setBulkSelection(newSelection);
    setSelectAll(newSelection.size === users.length && users.length > 0);
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setBulkSelection(new Set(users.map((u) => u._id)));
    } else {
      setBulkSelection(new Set());
    }
  };

  const handleBulkAction = async (action: "ban" | "delete") => {
    if (bulkSelection.size === 0) return;
    try {
      for (const id of bulkSelection) {
        if (action === "ban") {
          await banUser(id, { ban: true });
        } else if (action === "delete") {
          await deleteUser(id);
        }
      }
      setShowBulkDialog(false);
      setBulkAction(null);
      fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to ${action} users`
      );
    }
  };

  const validateAddUser = (userData: AddUserRequest): string | null => {
    if (!userData.name.trim()) return "Name is required";
    if (!userData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
      return "Invalid email format";
    if (!userData.password || userData.password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateAddUser(newUser);
    if (validationError) {
      setError(validationError);
      return;
    }
    // Clean up optional fields
    const cleanUserData: AddUserRequest = {
      ...newUser,
      phone: newUser.phone?.trim() || undefined,
      location: newUser.location?.trim() || undefined,
      age: newUser.age ? Number(newUser.age) : undefined,
    };
    try {
      await addUsers(cleanUserData);
      setShowAddModal(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        age: undefined,
        role: "user",
      });
      setError(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      // Note: You'll need to implement updateUser API call here
      // For now, simulate by refetching
      await getUser(selectedUser._id); // Placeholder
      setShowEditModal(false);
      setSelectedUser(null);
      setEditUser({});
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const openEditModal = async (user: User) => {
    try {
      const fullUser = await getUser(user._id);
      setSelectedUser(fullUser.user);
      setEditUser(fullUser.user);
      setShowEditModal(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load user details"
      );
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleBanUser = async (id: string, currentBanned: boolean) => {
    try {
      await banUser(id, { ban: !currentBanned });
      fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update ban status"
      );
    }
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : bVal > aVal
        ? 1
        : -1;
    });
  }, [users, sortKey, sortDirection]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-destructive">
            Error: {error}
            <Button variant="outline" onClick={fetchUsers} className="ml-4">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Users Management
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage users, roles, and permissions. Total: {totalUsers}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={() => setShowAddModal(true)}>Add User</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <Label htmlFor="users-search" className="sr-only">
                Search users
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <SearchInput
                  id="users-search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value as any);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as any);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {bulkSelection.size > 0 && (
            <div className="mb-4 p-3 bg-accent rounded-md flex items-center space-x-2">
              <Checkbox
                checked={selectAll}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
              <span className="text-sm font-medium">
                {bulkSelection.size} selected
              </span>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBulkAction("ban");
                  setShowBulkDialog(true);
                }}
              >
                Ban
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setBulkAction("delete");
                  setShowBulkDialog(true);
                }}
              >
                Delete
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all users"
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortKey === "name" &&
                        (sortDirection === "asc" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center gap-1">
                      Role
                      {sortKey === "role" &&
                        (sortDirection === "asc" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Joined
                      {sortKey === "createdAt" &&
                        (sortDirection === "asc" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Checkbox
                        checked={bulkSelection.has(user._id)}
                        onCheckedChange={(checked) =>
                          toggleBulkSelect(user._id, !!checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "secondary"
                            : user.role === "moderator"
                            ? "outline"
                            : "default"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.phone || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={user.isBanned ? "destructive" : "default"}
                        >
                          {user.isBanned ? "Banned" : "Active"}
                        </Badge>
                        <Badge
                          variant={user.isVerified ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(user.createdAt || "").toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={user.isBanned ? "default" : "destructive"}
                        onClick={() => handleBanUser(user._id, user.isBanned)}
                      >
                        {user.isBanned ? "Unban" : "Ban"}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the user {user.email}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className={cn(
                      "cursor-pointer",
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage > 3 ? currentPage - 2 + i : i + 1;
                  if (page > totalPages) return null;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    className={cn(
                      "cursor-pointer",
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Dialog */}
      <AlertDialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkAction!} {bulkSelection.size}{" "}
              user(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowBulkDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={
                bulkAction === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              onClick={() => handleBulkAction(bulkAction!)}
            >
              {bulkAction! === "ban" ? "Ban" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newUser.phone || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      phone: e.target.value || undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={newUser.age || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      age: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={newUser.location || ""}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    location: e.target.value || undefined,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({
                    ...newUser,
                    role: value as "user" | "moderator",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Add User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
            <DialogDescription>Update the user details.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    type="text"
                    value={editUser.name || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editUser.email || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={editUser.phone || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-age">Age</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={editUser.age || ""}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        age: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  type="text"
                  value={editUser.location || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, location: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editUser.role || "user"}
                  onValueChange={(value) =>
                    setEditUser({
                      ...editUser,
                      role: value as "user" | "moderator" | "admin",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-banned"
                  checked={editUser.isBanned || false}
                  onCheckedChange={(checked) =>
                    setEditUser({ ...editUser, isBanned: !!checked })
                  }
                />
                <Label htmlFor="edit-banned">Banned</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-verified"
                  checked={editUser.isVerified || false}
                  onCheckedChange={(checked) =>
                    setEditUser({ ...editUser, isVerified: !!checked })
                  }
                />
                <Label htmlFor="edit-verified">Verified</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  Update User
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UsersPage;
