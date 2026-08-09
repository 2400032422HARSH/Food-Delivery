import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdvancedReports() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [cityFilter, setCityFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("last_30_days");
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, [cityFilter, timeFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Mocking fetch delay
      await new Promise(res => setTimeout(res, 600));
      const data = await adminApi.getAdvancedReports(cityFilter, timeFilter);
      setReportData(data);
    } catch (error) {
      toast({
        title: "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate mock chart data based on loaded reports
  const generateRevenueData = () => {
    const days = timeFilter === "last_7_days" ? 7 : timeFilter === "last_30_days" ? 30 : 90;
    const data = [];
    let baseVal = reportData?.totalRevenue ? reportData.totalRevenue / days : 5000;
    
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      
      // Add some random fluctuation
      const fluc = (Math.random() * 0.4 - 0.2) * baseVal; // +/- 20%
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.max(0, Math.round(baseVal + fluc)),
      });
    }
    return data;
  };

  const generateOrdersByCityData = () => {
    return reportData?.revenueByCity.map((item: any) => ({
      name: item.city,
      orders: Math.floor(Math.random() * 500) + 100, // Mock random orders for the chart
      revenue: item.revenue
    })) || [];
  };

  if (loading && !reportData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  const revenueData = generateRevenueData();
  const cityData = generateOrdersByCityData();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-500 text-sm">Deep dive into revenue and order metrics across the platform.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200 p-1 shadow-sm">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[130px] border-0 focus:ring-0 shadow-none h-8">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Everywhere</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>

            <div className="w-px h-6 bg-gray-200" />

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px] border-0 focus:ring-0 shadow-none h-8">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm shadow-indigo-100 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">₹{reportData?.totalRevenue?.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              ↑ 12.5% from last period
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-orange-100 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{reportData?.totalOrders?.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              ↑ 8.2% from last period
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-blue-100 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">₹{reportData?.averageOrderValue?.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              Steady
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-green-100 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{reportData?.activeCustomers?.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              ↑ 2.4% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Daily revenue breakdown for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[350px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#ea580c"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>Orders by City</CardTitle>
            <CardDescription>Geographic distribution of order volume</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[350px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cityData}
                    layout="vertical"
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
                      width={80}
                    />
                    <Tooltip
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [value, 'Orders']}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="#3b82f6" 
                      radius={[0, 4, 4, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>Top Performing Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData?.revenueByRestaurant.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                      #{i + 1}
                    </div>
                    <span className="font-medium text-gray-900">{item.restaurantName}</span>
                  </div>
                  <span className="font-bold text-gray-700">₹{item.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Keeping empty space balanced or add another static metric list */}
        <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Recent Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Highest order volume in Mumbai</p>
                    <p className="text-sm text-gray-500">Record 542 orders created between 7PM - 9PM yesterday.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="font-medium text-gray-900">Coupon WELCOME50 impact</p>
                    <p className="text-sm text-gray-500">Drove a 15% increase in user acquisition this week.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-orange-500" />
                  <div>
                    <p className="font-medium text-gray-900">Spike in Biryani category</p>
                    <p className="text-sm text-gray-500">Biryani remains the top-selling category representing 35% of total sales.</p>
                  </div>
                </div>
              </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
