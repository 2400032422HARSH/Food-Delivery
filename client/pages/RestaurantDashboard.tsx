import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi, orderApi } from "@/lib/api";
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
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Star,
  Package,
  Flame,
  Bell,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalOrders: number;
  todaysOrders: number;
  totalRevenue: number;
  todaysRevenue: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  outForDeliveryOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  items: any[];
  totalPrice: number;
  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  createdAt: string;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100", icon: "⏳" },
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

const statusFlow = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "restaurant") {
      navigate("/login");
      return;
    }
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        dashboardApi.getRestaurantStats(),
        orderApi.getAll(),
      ]);
      setStats(statsData);
      setOrders(
        (ordersData as Order[]).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await orderApi.updateStatus(orderId, newStatus);
      await loadData();
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  const filteredOrders = selectedStatus
    ? orders.filter((o) => o.status === selectedStatus)
    : orders;

  const KPICard = ({
    label,
    value,
    icon: Icon,
    onClick,
  }: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    onClick?: () => void;
  }) => (
    <Card
      className={
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{label}</span>
          <Icon className="w-5 h-5 text-orange-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Harsh Anand Restaurant Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your orders and track performance
          </p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <KPICard
            label="Today's Orders"
            value={stats.todaysOrders}
            icon={Package}
            onClick={() => setSelectedStatus(null)}
          />
          <KPICard
            label="Total Orders"
            value={stats.totalOrders}
            icon={TrendingUp}
            onClick={() => setSelectedStatus(null)}
          />
          <KPICard
            label="Today's Revenue"
            value={`₹${stats.todaysRevenue.toLocaleString()}`}
            icon={TrendingUp}
            onClick={() => setSelectedStatus(null)}
          />
          <KPICard
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            onClick={() => setSelectedStatus(null)}
          />
          <KPICard
            label="Active Orders"
            value={
              stats.pendingOrders +
              stats.preparingOrders +
              stats.readyOrders +
              stats.outForDeliveryOrders
            }
            icon={Package}
          />
          <KPICard
            label="Cancelled"
            value={stats.cancelledOrders}
            icon={AlertCircle}
          />
        </div>

        {/* Status Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Status Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {[
              { key: "pending", label: "Pending", count: stats.pendingOrders },
              {
                key: "accepted",
                label: "Accepted",
                count: stats.preparingOrders,
              },
              {
                key: "preparing",
                label: "Preparing",
                count: stats.preparingOrders,
              },
              { key: "ready", label: "Ready", count: stats.readyOrders },
              {
                key: "out_for_delivery",
                label: "Out for Delivery",
                count: stats.outForDeliveryOrders,
              },
              {
                key: "delivered",
                label: "Delivered",
                count: stats.deliveredOrders,
              },
              {
                key: "cancelled",
                label: "Cancelled",
                count: stats.cancelledOrders,
              },
            ].map(({ key, label, count }) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedStatus === key ? "ring-2 ring-orange-500" : ""
                } hover:shadow-md`}
                onClick={() =>
                  setSelectedStatus(selectedStatus === key ? null : key)
                }
              >
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">{label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Orders{" "}
              {selectedStatus &&
                `(${statusConfig[selectedStatus as keyof typeof statusConfig]?.label || selectedStatus})`}
            </CardTitle>
            <CardDescription>{filteredOrders.length} orders</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-gray-700">
                      <th className="text-left py-3 px-4 font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Time
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const currentStatusIndex = statusFlow.indexOf(
                        order.status as any,
                      );
                      const nextStatus = statusFlow[currentStatusIndex + 1];
                      const canProgress =
                        nextStatus &&
                        order.status !== "delivered" &&
                        order.status !== "cancelled";

                      return (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            {order.id}
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            ₹{order.totalPrice.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              className={`${statusConfig[order.status]?.color} border-0`}
                            >
                              {statusConfig[order.status]?.label}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-gray-500 text-xs">
                            {formatDistanceToNow(new Date(order.createdAt), {
                              addSuffix: true,
                            })}
                          </td>
                          <td className="py-4 px-4">
                            {canProgress && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateOrderStatus(order.id, nextStatus)
                                }
                                disabled={updatingOrderId === order.id}
                                className="bg-orange-600 hover:bg-orange-700 text-xs"
                              >
                                {updatingOrderId === order.id ? (
                                  <>
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  `→ ${nextStatus.replace(/_/g, " ")}`
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
