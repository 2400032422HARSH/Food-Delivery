import { useState } from "react";
import { mockRestaurants, Coupon } from "@shared/data";
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
import { Plus, Trash2, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/context/AdminContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CouponsManagement() {
  const { coupons, updateCoupon, deleteCoupon: removeCoupon, addCoupon } = useAdmin();
  const { toast } = useToast();
  
  // Assign Coupon State
  const [assigningCoupon, setAssigningCoupon] = useState<Coupon | null>(null);

  // Create Coupon State
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    discountPercentage: 0,
    maxDiscount: 0,
    minOrderAmount: 0,
    isActive: true,
    applicableRestaurants: []
  });

  const toggleStatus = (id: string, isActive: boolean) => {
    const c = coupons.find((x) => x.id === id);
    if (c) {
      updateCoupon({ ...c, isActive });
    }
    toast({
      title: "Coupon Updated",
      description: `Coupon is now ${isActive ? "active" : "inactive"}`,
    });
  };

  const deleteCoupon = (id: string) => {
    removeCoupon(id);
    toast({
      title: "Coupon Deleted",
      description: "Coupon has been removed.",
    });
  };

  const handleToggleRestaurantAssigned = (restaurantId: string) => {
    if (!assigningCoupon) return;
    
    setAssigningCoupon((prev) => {
      if (!prev) return prev;
      const alreadyAssigned = prev.applicableRestaurants.includes(restaurantId);
      return {
        ...prev,
        applicableRestaurants: alreadyAssigned
          ? prev.applicableRestaurants.filter((id) => id !== restaurantId)
          : [...prev.applicableRestaurants, restaurantId],
      };
    });
  };

  const handleSaveAssignments = () => {
    if (!assigningCoupon) return;
    updateCoupon(assigningCoupon);
    setAssigningCoupon(null);
    toast({
      title: "Assignments Saved",
      description: "The coupon has been linked to the selected restaurants.",
    });
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code) return;
    const coupon: Coupon = {
      id: `C${Date.now()}`,
      code: newCoupon.code,
      discountPercentage: newCoupon.discountPercentage || 0,
      maxDiscount: newCoupon.maxDiscount || 0,
      minOrderAmount: newCoupon.minOrderAmount || 0,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      applicableRestaurants: []
    };
    addCoupon(coupon);
    setIsCreatingCoupon(false);
    setNewCoupon({ code: "", discountPercentage: 0, maxDiscount: 0, minOrderAmount: 0 });
    toast({
      title: "Coupon Created",
      description: `Coupon ${coupon.code} created successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Coupons & Offers</h2>
          <p className="text-gray-500 text-sm">Create and assign promotional codes to boost sales.</p>
        </div>
        <Button onClick={() => setIsCreatingCoupon(true)} className="bg-orange-600 hover:bg-orange-700 shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold text-gray-600">Code</TableHead>
                <TableHead className="font-semibold text-gray-600">Offer Value</TableHead>
                <TableHead className="font-semibold text-gray-600">Validity Period</TableHead>
                <TableHead className="font-semibold text-gray-600">Assigned To</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TicketIcon className="w-5 h-5 text-orange-500" />
                      <span className="font-bold text-gray-900 uppercase">{coupon.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-emerald-600">{coupon.discountPercentage}% OFF</span>
                    <div className="text-xs text-gray-500">Up to ₹{coupon.maxDiscount} | Min ₹{coupon.minOrderAmount}</div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    Ends {new Date(coupon.validUntil).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-0">
                      {coupon.applicableRestaurants.length === 0 ? "Global" : `${coupon.applicableRestaurants.length} Restaurants`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        coupon.isActive
                          ? "bg-emerald-100 text-emerald-800 border-0"
                          : "bg-gray-100 text-gray-800 border-0"
                      }`}
                    >
                      {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => setAssigningCoupon(coupon)}
                    >
                      <Link className="w-4 h-4 mr-1" />
                      Assign
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(coupon.id, !coupon.isActive)}
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteCoupon(coupon.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Assign Coupon Dialog */}
      <Dialog open={!!assigningCoupon} onOpenChange={(open) => !open && setAssigningCoupon(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Coupon</DialogTitle>
            <DialogDescription>
              Select restaurants that can accept this coupon. If none are selected, it applies globally.
            </DialogDescription>
          </DialogHeader>
          {assigningCoupon && (
            <div className="py-4 space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {mockRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex items-center space-x-2 border-b border-gray-100 pb-3 last:border-0">
                  <Checkbox
                    id={restaurant.id}
                    checked={assigningCoupon.applicableRestaurants.includes(restaurant.id)}
                    onCheckedChange={() => handleToggleRestaurantAssigned(restaurant.id)}
                  />
                  <div className="flex items-center gap-3 w-full">
                    <img src={restaurant.logo} alt={restaurant.name} className="w-8 h-8 rounded-full border border-gray-100" />
                    <label
                      htmlFor={restaurant.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {restaurant.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigningCoupon(null)}>Cancel</Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSaveAssignments}>
              Save assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Coupon Dialog */}
      <Dialog open={isCreatingCoupon} onOpenChange={setIsCreatingCoupon}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Coupon</DialogTitle>
            <DialogDescription>
              Create a new promotional discount for your customers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">Code Name</Label>
              <Input
                id="code"
                placeholder="e.g. SUMMER50"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                className="col-span-3 uppercase"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="disc" className="text-right">Discount %</Label>
              <Input
                id="disc"
                type="number"
                placeholder="20"
                value={newCoupon.discountPercentage}
                onChange={(e) => setNewCoupon({...newCoupon, discountPercentage: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxDisc" className="text-right">Max Disc(₹)</Label>
              <Input
                id="maxDisc"
                type="number"
                placeholder="100"
                value={newCoupon.maxDiscount}
                onChange={(e) => setNewCoupon({...newCoupon, maxDiscount: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minOrder" className="text-right">Min Order(₹)</Label>
              <Input
                id="minOrder"
                type="number"
                placeholder="500"
                value={newCoupon.minOrderAmount}
                onChange={(e) => setNewCoupon({...newCoupon, minOrderAmount: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingCoupon(false)}>Cancel</Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleCreateCoupon} disabled={!newCoupon.code}>
              Create Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Internal SVG Helper
function TicketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
