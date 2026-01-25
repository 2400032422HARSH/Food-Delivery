import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  MapPin,
  Clock,
  DollarSign,
  Star,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Order {
  id: string;
  restaurantId: string;
  items: any[];
  totalPrice: number;
  status: string;
  createdAt: string;
  estimatedDeliveryTime: string;
  rating?: number;
  review?: string;
}

const statusSteps = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

const statusConfig: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  pending: { label: "Order Placed", color: "bg-yellow-100", icon: "⏳" },
  accepted: { label: "Accepted", color: "bg-blue-100", icon: "✅" },
  preparing: { label: "Preparing", color: "bg-purple-100", icon: "👨‍🍳" },
  ready: { label: "Ready", color: "bg-indigo-100", icon: "📦" },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-cyan-100",
    icon: "🚴",
  },
  delivered: { label: "Delivered", color: "bg-green-100", icon: "🏠" },
  cancelled: { label: "Cancelled", color: "bg-red-100", icon: "❌" },
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ratingModal, setRatingModal] = useState<{
    orderId: string;
    rating: number;
    review: string;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadOrders();

    // Refresh orders every 10 seconds
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const loadOrders = async () => {
    try {
      const data = await orderApi.getAll();
      setOrders(
        data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (!ratingModal) return;

    try {
      await orderApi.updateRating(
        ratingModal.orderId,
        ratingModal.rating,
        ratingModal.review,
      );
      await loadOrders();
      setRatingModal(null);
      toast({
        title: "Thank you!",
        description: "Your rating has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save rating",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status),
  );
  const pastOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status),
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-12">
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start ordering from your favorite restaurants!
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Browse Restaurants
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Active Orders ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Orders ({pastOrders.length})
              </TabsTrigger>
            </TabsList>

            {/* Active Orders */}
            <TabsContent value="active" className="space-y-4">
              {activeOrders.length === 0 ? (
                <Card>
                  <CardContent className="pt-8">
                    <p className="text-center text-gray-500 py-8">
                      No active orders
                    </p>
                  </CardContent>
                </Card>
              ) : (
                activeOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{order.id}</CardTitle>
                          <CardDescription>
                            {formatDistanceToNow(new Date(order.createdAt), {
                              addSuffix: true,
                            })}
                          </CardDescription>
                        </div>
                        <Badge
                          className={`${statusConfig[order.status]?.color} border-0`}
                        >
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Order Status Timeline */}
                      <div className="py-4">
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="font-semibold text-gray-900">
                            Order Status
                          </span>
                          <span className="text-gray-600">
                            Est. delivery:{" "}
                            {new Date(
                              order.estimatedDeliveryTime,
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          {statusSteps.map((step, idx) => {
                            const stepIndex = statusSteps.indexOf(order.status);
                            const isActive =
                              statusSteps.indexOf(step) <= stepIndex;
                            const isCurrent = step === order.status;

                            return (
                              <div
                                key={step}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                    isActive
                                      ? "bg-orange-500 text-white"
                                      : "bg-gray-200 text-gray-600"
                                  } ${isCurrent ? "ring-4 ring-orange-300" : ""}`}
                                >
                                  {idx + 1}
                                </div>
                                <span className="text-xs mt-2 text-center max-w-20 truncate text-gray-600 font-medium">
                                  {step.replace(/_/g, " ")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          Items ({order.items.length})
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm bg-gray-50 p-3 rounded"
                            >
                              <span className="text-gray-700">
                                {item.menuItemId} x{item.quantity}
                              </span>
                              <span className="font-medium text-gray-900">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t pt-4 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          Total Amount
                        </span>
                        <span className="text-xl font-bold text-orange-600">
                          ₹{order.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Past Orders */}
            <TabsContent value="past" className="space-y-4">
              {pastOrders.length === 0 ? (
                <Card>
                  <CardContent className="pt-8">
                    <p className="text-center text-gray-500 py-8">
                      No past orders
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pastOrders.map((order) => {
                  const orderRating = ratingModal?.orderId === order.id;

                  return (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {order.id}
                            </CardTitle>
                            <CardDescription>
                              {formatDistanceToNow(new Date(order.createdAt), {
                                addSuffix: true,
                              })}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${
                                order.status === "delivered"
                                  ? "bg-green-100 border-0"
                                  : "bg-red-100 border-0"
                              }`}
                            >
                              {statusConfig[order.status]?.label ||
                                order.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            Total Amount
                          </span>
                          <span className="text-xl font-bold text-orange-600">
                            ₹{order.totalPrice.toLocaleString()}
                          </span>
                        </div>

                        {order.status === "delivered" && !orderRating && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              setRatingModal({
                                orderId: order.id,
                                rating: 5,
                                review: "",
                              })
                            }
                            className="w-full"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Rate Order
                          </Button>
                        )}

                        {orderRating && (
                          <div className="space-y-3 pt-4 border-t">
                            <div>
                              <label className="text-sm font-semibold text-gray-900">
                                Rating: {ratingModal!.rating} ⭐
                              </label>
                              <div className="flex gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() =>
                                      setRatingModal({
                                        ...ratingModal!,
                                        rating: star,
                                      })
                                    }
                                    className={`text-2xl transition-transform hover:scale-110 ${
                                      star <= ratingModal!.rating
                                        ? "opacity-100"
                                        : "opacity-30"
                                    }`}
                                  >
                                    ⭐
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-gray-900">
                                Review
                              </label>
                              <textarea
                                value={ratingModal!.review}
                                onChange={(e) =>
                                  setRatingModal({
                                    ...ratingModal!,
                                    review: e.target.value,
                                  })
                                }
                                placeholder="Share your feedback..."
                                className="w-full mt-2 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows={3}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={submitRating}
                                className="flex-1 bg-orange-600 hover:bg-orange-700"
                              >
                                Submit
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setRatingModal(null)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
