import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Store,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  todaysOrders: number;
  totalRevenue: number;
  todaysRevenue: number;
  activeOrders: number;
  cancelledOrders: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    loadStats();
    const interval = setInterval(loadStats, 15000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats", error);
      toast({
        title: "Error",
        description: "Failed to load admin stats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  const KPICard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "orange",
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <Icon className={`w-5 h-5 text-${color}-500`} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  const totalRevenueGrowth =
    stats.todaysRevenue > 0
      ? ((stats.todaysRevenue / (stats.totalRevenue / 30)) * 100).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Harsh Anand Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Platform overview and management</p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Users"
            value={stats.totalUsers}
            subtitle="Active customers"
            icon={Users}
          />
          <KPICard
            title="Total Restaurants"
            value={stats.totalRestaurants}
            subtitle="Active restaurants"
            icon={Store}
          />
          <KPICard
            title="Total Orders"
            value={stats.totalOrders}
            subtitle={`${stats.todaysOrders} today`}
            icon={ShoppingCart}
          />
          <KPICard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            subtitle={`₹${stats.todaysRevenue.toLocaleString()} today`}
            icon={TrendingUp}
          />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today's Performance</CardTitle>
              <CardDescription>Daily metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Orders</span>
                <span className="font-bold text-gray-900">
                  {stats.todaysOrders}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Revenue</span>
                <span className="font-bold text-gray-900">
                  ₹{stats.todaysRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. per order</span>
                <span className="font-bold text-gray-900">
                  {stats.todaysOrders > 0
                    ? `₹${Math.round(stats.todaysRevenue / stats.todaysOrders).toLocaleString()}`
                    : "₹0"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Status</CardTitle>
              <CardDescription>Current orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Active Orders</span>
                <Badge className="bg-orange-100 text-orange-700 border-0">
                  {stats.activeOrders}
                </Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Cancelled Orders</span>
                <Badge className="bg-red-100 text-red-700 border-0">
                  {stats.cancelledOrders}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-bold text-gray-900">
                  {stats.totalOrders > 0
                    ? (
                        ((stats.totalOrders - stats.cancelledOrders) /
                          stats.totalOrders) *
                        100
                      ).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue Metrics</CardTitle>
              <CardDescription>Financial overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Daily Average</span>
                <span className="font-bold text-gray-900">
                  ₹{Math.round(stats.totalRevenue / 30).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Today's Growth</span>
                <Badge className="bg-green-100 text-green-700 border-0">
                  +{totalRevenueGrowth}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Order Value</span>
                <span className="font-bold text-gray-900">
                  {stats.totalOrders > 0
                    ? `₹${Math.round(
                        stats.totalRevenue / stats.totalOrders,
                      ).toLocaleString()}`
                    : "₹0"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Management Features</CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold">Restaurants Management</p>
                  <p>
                    Approve/reject new restaurants, block/unblock, edit details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold">Users Management</p>
                  <p>View and manage customer accounts, block/unblock users</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold">Coupons & Offers</p>
                  <p>Create, manage, and assign promotional codes</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold">Advanced Reports</p>
                  <p>Detailed analytics by restaurant, city, time period</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
