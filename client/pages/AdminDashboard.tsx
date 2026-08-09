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
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Users,
  Store,
  ShoppingCart,
  TrendingUp,
  Loader2,
  PieChart,
  Ticket,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import RestaurantsManagement from "@/components/admin/RestaurantsManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import CouponsManagement from "@/components/admin/CouponsManagement";
import AdvancedReports from "@/components/admin/AdvancedReports";
import { AdminProvider } from "@/context/AdminContext";

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
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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

  const handleLogout = () => {
    logout();
    navigate("/");
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
    <Card className="border-none shadow-sm shadow-orange-100 bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between text-gray-500">
          <span>{title}</span>
          <div className={`p-2 bg-${color}-50 rounded-lg`}>
            <Icon className={`w-4 h-4 text-${color}-600`} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  const totalRevenueGrowth =
    stats.todaysRevenue > 0
      ? ((stats.todaysRevenue / (stats.totalRevenue / 30)) * 100).toFixed(1)
      : "0";

  const renderContent = () => {
    switch (activeTab) {
      case "restaurants":
        return <RestaurantsManagement />;
      case "users":
        return <UsersManagement />;
      case "coupons":
        return <CouponsManagement />;
      case "reports":
        return <AdvancedReports />;
      case "overview":
      default:
        return (
          <div className="space-y-8 animate-in fade-in-50 duration-500">
            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Users"
                value={stats.totalUsers}
                subtitle="Active customers"
                icon={Users}
                color="blue"
              />
              <KPICard
                title="Total Restaurants"
                value={stats.totalRestaurants}
                subtitle="Active restaurants"
                icon={Store}
                color="green"
              />
              <KPICard
                title="Total Orders"
                value={stats.totalOrders}
                subtitle={`${stats.todaysOrders} today`}
                icon={ShoppingCart}
                color="purple"
              />
              <KPICard
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                subtitle={`₹${stats.todaysRevenue.toLocaleString()} today`}
                icon={TrendingUp}
                color="orange"
              />
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 shadow-sm border-gray-100">
                <CardHeader>
                  <CardTitle className="text-base text-gray-800">Today's Performance</CardTitle>
                  <CardDescription>Daily metrics snapshot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Orders</span>
                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded">
                      {stats.todaysOrders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
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

              <Card className="col-span-1 shadow-sm border-gray-100">
                <CardHeader>
                  <CardTitle className="text-base text-gray-800">Order Status</CardTitle>
                  <CardDescription>Real-time order tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Active Orders</span>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">
                      {stats.activeOrders}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Cancelled Orders</span>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0">
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

              <Card className="col-span-1 shadow-sm border-gray-100">
                <CardHeader>
                  <CardTitle className="text-base text-gray-800">Revenue Metrics</CardTitle>
                  <CardDescription>Financial overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Daily Average</span>
                    <span className="font-bold text-gray-900">
                      ₹{Math.round(stats.totalRevenue / 30).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Today's Growth</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {totalRevenueGrowth}%
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
          </div>
        );
    }
  };

  return (
    <AdminProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        <Sidebar variant="sidebar" className="border-r border-gray-200 bg-white">
          <SidebarHeader className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-orange-600 text-white p-2 rounded-lg">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">Admin<span className="text-orange-600">Panel</span></h2>
                <p className="text-xs text-gray-500">Harsh Anand Food</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Menu
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-4">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                      className="w-full text-gray-600 data-[active=true]:bg-orange-50 data-[active=true]:text-orange-700 rounded-lg py-5 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5 mr-3" />
                      <span className="font-medium">Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "restaurants"}
                      onClick={() => setActiveTab("restaurants")}
                      className="w-full text-gray-600 data-[active=true]:bg-orange-50 data-[active=true]:text-orange-700 rounded-lg py-5 transition-colors"
                    >
                      <Store className="w-5 h-5 mr-3" />
                      <span className="font-medium">Restaurants</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "users"}
                      onClick={() => setActiveTab("users")}
                      className="w-full text-gray-600 data-[active=true]:bg-orange-50 data-[active=true]:text-orange-700 rounded-lg py-5 transition-colors"
                    >
                      <Users className="w-5 h-5 mr-3" />
                      <span className="font-medium">Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "coupons"}
                      onClick={() => setActiveTab("coupons")}
                      className="w-full text-gray-600 data-[active=true]:bg-orange-50 data-[active=true]:text-orange-700 rounded-lg py-5 transition-colors"
                    >
                      <Ticket className="w-5 h-5 mr-3" />
                      <span className="font-medium">Coupons</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "reports"}
                      onClick={() => setActiveTab("reports")}
                      className="w-full text-gray-600 data-[active=true]:bg-orange-50 data-[active=true]:text-orange-700 rounded-lg py-5 transition-colors"
                    >
                      <PieChart className="w-5 h-5 mr-3" />
                      <span className="font-medium">Reports Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout Admin</span>
            </button>
          </div>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto bg-[#F8FAFC]">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2 md:hidden" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 capitalize">
                  {activeTab === "overview" ? "Dashboard Overview" : activeTab.replace(/([A-Z])/g, ' $1').trim()}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-green-600 font-medium">Administrator</p>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold border-2 border-orange-200">
                {user.name.charAt(0)}
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
    </AdminProvider>
  );
}
