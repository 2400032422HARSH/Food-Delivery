import { useState } from "react";
import { Restaurant } from "@shared/data";
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
import { Check, X, ShieldAlert, Edit, Save, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/context/AdminContext";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RestaurantsManagement() {
  const { restaurants, updateRestaurant } = useAdmin();
  const { toast } = useToast();
  
  // Edit State
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  const handleUpdateStatus = (id: string, status: Restaurant["status"]) => {
    const r = restaurants.find((x) => x.id === id);
    if (r) {
      updateRestaurant({ ...r, status });
    }
    toast({
      title: "Status Updated",
      description: `Restaurant status changed to ${status}`,
    });
  };

  const handleToggleOnline = (id: string, isOpen: boolean) => {
    const r = restaurants.find((x) => x.id === id);
    if (r) {
      updateRestaurant({ ...r, isOpen });
    }
    toast({
      title: "Store Status Updated",
      description: isOpen ? "Restaurant is now Online" : "Restaurant is now Offline",
    });
  };

  const handleSaveEdit = () => {
    if (!editingRestaurant) return;
    updateRestaurant(editingRestaurant);
    setEditingRestaurant(null);
    toast({
      title: "Restaurant Updated",
      description: "The details have been saved successfully.",
    });
  };

  const getStatusBadge = (status: Restaurant["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0">Rejected</Badge>;
      case "blocked":
        return <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-300 border-0">Blocked</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Restaurants Management</h2>
          <p className="text-gray-500 text-sm">Approve, block, and manage partner restaurants.</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 shadow-md">
          <Building2 className="w-4 h-4 mr-2" /> Add Partner
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-semibold text-gray-600">Restaurant Info</TableHead>
              <TableHead className="font-semibold text-gray-600">Location</TableHead>
              <TableHead className="font-semibold text-gray-600">Min Order</TableHead>
              <TableHead className="font-semibold text-gray-600">Online</TableHead>
              <TableHead className="font-semibold text-gray-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={restaurant.logo} alt={restaurant.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                    <div>
                      <div className="font-bold text-gray-900">{restaurant.name}</div>
                      <div className="text-xs text-gray-500">{restaurant.cuisine.join(", ")}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{restaurant.city}</TableCell>
                <TableCell className="text-gray-600 font-medium">₹{restaurant.minOrder}</TableCell>
                <TableCell>
                  <Switch
                    checked={restaurant.isOpen}
                    onCheckedChange={(checked) => handleToggleOnline(restaurant.id, checked)}
                    disabled={restaurant.status !== "approved"}
                  />
                </TableCell>
                <TableCell>{getStatusBadge(restaurant.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  {restaurant.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 bg-emerald-50/50"
                        onClick={() => handleUpdateStatus(restaurant.id, "approved")}
                      >
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-red-50/50"
                        onClick={() => handleUpdateStatus(restaurant.id, "rejected")}
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {restaurant.status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleUpdateStatus(restaurant.id, "blocked")}
                    >
                      <ShieldAlert className="w-4 h-4 mr-1" /> Block
                    </Button>
                  )}
                  {(restaurant.status === "blocked" ||
                    restaurant.status === "rejected") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => handleUpdateStatus(restaurant.id, "approved")}
                    >
                      <Check className="w-4 h-4 mr-1" /> Unblock
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => setEditingRestaurant(restaurant)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Restaurant Dialog */}
      <Dialog open={!!editingRestaurant} onOpenChange={(open) => !open && setEditingRestaurant(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
            <DialogDescription>
              Update the details for this partner. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingRestaurant && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={editingRestaurant.name}
                  onChange={(e) => setEditingRestaurant({...editingRestaurant, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">City</Label>
                <Input
                  id="city"
                  value={editingRestaurant.city}
                  onChange={(e) => setEditingRestaurant({...editingRestaurant, city: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minOrder" className="text-right">Min Order</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={editingRestaurant.minOrder}
                  onChange={(e) => setEditingRestaurant({...editingRestaurant, minOrder: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deliveryFee" className="text-right">Delivery Fee</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  value={editingRestaurant.deliveryFee}
                  onChange={(e) => setEditingRestaurant({...editingRestaurant, deliveryFee: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRestaurant(null)}>Cancel</Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSaveEdit}>
              <Save className="w-4 h-4 mr-2" /> Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
