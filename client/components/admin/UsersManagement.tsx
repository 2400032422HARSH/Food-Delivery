import { useState } from "react";
import { User } from "@shared/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/context/AdminContext";

export default function UsersManagement() {
  const { users, updateUser } = useAdmin();
  const { toast } = useToast();

  const handleUpdateStatus = (id: string, status: User["status"]) => {
    const u = users.find((x) => x.id === id);
    if (u) {
      updateUser({ ...u, status });
    }
    toast({
      title: "Status Updated",
      description: `User status changed to ${status}`,
    });
  };

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Users</h2>
      </div>
      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(user.status)} border-0`}
                  >
                    {user.status?.toUpperCase() || "UNKNOWN"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {user.status === "active" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleUpdateStatus(user.id, "blocked")}
                    >
                      <ShieldAlert className="w-4 h-4 mr-1" />
                      Block
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleUpdateStatus(user.id, "active")}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Unblock
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
