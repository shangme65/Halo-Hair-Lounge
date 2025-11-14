"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Search,
  UserPlus,
  Trash2,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  CalendarCheck,
} from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "STAFF" | "ADMIN";
  phone: string | null;
  image: string | null;
  createdAt: string;
  _count: {
    appointments: number;
    orders: number;
  };
}

export default function UsersManagement() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<"USER" | "STAFF" | "ADMIN">("STAFF");

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    } else {
      fetchUsers();
    }
  }, [session, router]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "ALL") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handlePromoteUser = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role === "USER" ? "STAFF" : user.role);
    setShowPromoteModal(true);
  };

  const confirmPromote = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success(`User role updated to ${newRole}`);
        setShowPromoteModal(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <ShieldCheck className="text-red-500" size={20} />;
      case "STAFF":
        return <Shield className="text-yellow-500" size={20} />;
      default:
        return <User className="text-blue-500" size={20} />;
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
      STAFF: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      USER: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          styles[role as keyof typeof styles]
        }`}
      >
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    staff: users.filter((u) => u.role === "STAFF").length,
    users: users.filter((u) => u.role === "USER").length,
  };

  return (
    <div className="flex min-h-screen bg-dark-950">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              User Management
            </h1>
            <p className="text-dark-400">Manage users and assign roles</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-dark-900 border-dark-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.total}
                  </p>
                </div>
                <User className="text-primary-500" size={32} />
              </div>
            </Card>

            <Card className="bg-dark-900 border-dark-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Admins</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">
                    {stats.admins}
                  </p>
                </div>
                <ShieldCheck className="text-red-500" size={32} />
              </div>
            </Card>

            <Card className="bg-dark-900 border-dark-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Staff</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-1">
                    {stats.staff}
                  </p>
                </div>
                <Shield className="text-yellow-500" size={32} />
              </div>
            </Card>

            <Card className="bg-dark-900 border-dark-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Customers</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">
                    {stats.users}
                  </p>
                </div>
                <User className="text-blue-500" size={32} />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-dark-900 border-dark-800 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-dark-800 border-dark-700 text-white"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">All Roles</option>
                <option value="USER">Users</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </Card>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-dark-900 border-dark-800 hover:border-primary-500/50 transition-all">
                  <div className="space-y-4">
                    {/* User Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(user.role)}
                        <div>
                          <h3 className="font-semibold text-white">
                            {user.name || "No Name"}
                          </h3>
                          {getRoleBadge(user.role)}
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-dark-400">
                        <Mail size={16} />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-dark-400">
                          <Phone size={16} />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-dark-400">
                        <Calendar size={16} />
                        <span>
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 pt-3 border-t border-dark-800">
                      <div className="flex items-center gap-2 text-dark-400 text-sm">
                        <CalendarCheck size={16} />
                        <span>{user._count.appointments} appts</span>
                      </div>
                      <div className="flex items-center gap-2 text-dark-400 text-sm">
                        <ShoppingBag size={16} />
                        <span>{user._count.orders} orders</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {user.id !== session?.user?.id && (
                      <div className="flex gap-2 pt-3 border-t border-dark-800">
                        <Button
                          onClick={() => handlePromoteUser(user)}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm py-2"
                        >
                          <UserPlus size={16} />
                          Change Role
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}

                    {user.id === session?.user?.id && (
                      <div className="pt-3 border-t border-dark-800">
                        <p className="text-xs text-dark-500 text-center">
                          This is your account
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <Card className="bg-dark-900 border-dark-800">
              <p className="text-center text-dark-400 py-8">
                No users found matching your criteria
              </p>
            </Card>
          )}
        </div>
      </main>

      {/* Promote Modal */}
      <AnimatePresence>
        {showPromoteModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPromoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-900 rounded-lg p-6 w-full max-w-md border border-dark-800"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">
                Change User Role
              </h2>

              <div className="mb-4">
                <p className="text-dark-400 mb-2">User: {selectedUser.name}</p>
                <p className="text-dark-400 mb-4">
                  Email: {selectedUser.email}
                </p>
                <p className="text-dark-400 mb-2">
                  Current Role: {selectedUser.role}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-white mb-2">Select New Role</label>
                <select
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value as "USER" | "STAFF" | "ADMIN")
                  }
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="USER">USER - Regular customer</option>
                  <option value="STAFF">
                    STAFF - Can manage appointments only
                  </option>
                  <option value="ADMIN">ADMIN - Full admin access</option>
                </select>

                <div className="mt-4 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                  <p className="text-xs text-dark-400">
                    {newRole === "STAFF" &&
                      "⚠️ Staff members can only approve/decline appointments"}
                    {newRole === "ADMIN" &&
                      "⚠️ Admins have full control over all sections"}
                    {newRole === "USER" &&
                      "Regular user access with no admin privileges"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowPromoteModal(false)}
                  className="flex-1 bg-dark-800 hover:bg-dark-700 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmPromote}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
