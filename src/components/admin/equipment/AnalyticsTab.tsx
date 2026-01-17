import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Calendar,
  Clock,
  Truck,
} from "lucide-react";
import { 
  useAcquisitionMetrics, 
  useAcquisitionsByWeek, 
  useInventoryMetrics, 
  useRentalMetrics,
  useRentalsByMonth,
} from "@/hooks/useEquipmentAnalytics";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsTab() {
  const { data: acquisitionMetrics } = useAcquisitionMetrics();
  const { data: acquisitionsByWeek } = useAcquisitionsByWeek();
  const { data: inventoryMetrics } = useInventoryMetrics();
  const { data: rentalMetrics } = useRentalMetrics();
  const { data: rentalsByMonth } = useRentalsByMonth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Acquisition Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Acquisition Requests</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold">{acquisitionMetrics?.total || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-600">{acquisitionMetrics?.conversionRate || 0}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">MRI Requests</p>
              <p className="text-2xl font-bold text-blue-600">{acquisitionMetrics?.mri || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">CT Requests</p>
              <p className="text-2xl font-bold text-purple-600">{acquisitionMetrics?.ct || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 dark:border-red-900">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{acquisitionMetrics?.urgent || 0}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requests by Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={acquisitionsByWeek || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory by Modality</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={inventoryMetrics?.byModality || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(inventoryMetrics?.byModality || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Inventory Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{inventoryMetrics?.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(inventoryMetrics?.totalValue || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-600">{inventoryMetrics?.available || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Rentable Units</p>
              <p className="text-2xl font-bold text-blue-600">{inventoryMetrics?.rentable || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Utilization</p>
              <p className="text-2xl font-bold">{inventoryMetrics?.utilizationRate || 0}%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rental Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Rental Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Rentals</p>
              <p className="text-2xl font-bold text-green-600">{rentalMetrics?.active || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(rentalMetrics?.monthlyRevenue || 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(rentalMetrics?.totalRevenue || 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg Duration</p>
              <p className="text-2xl font-bold">{rentalMetrics?.avgDuration || 0} days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Upcoming Returns</p>
              <p className="text-2xl font-bold text-orange-600">{rentalMetrics?.upcomingReturns?.length || 0}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rental Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rental Revenue by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rentalsByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip formatter={(value: number, name: string) => 
                name === 'revenue' ? formatCurrency(value) : value
              } />
              <Legend />
              <Bar yAxisId="left" dataKey="rentals" fill="#3b82f6" name="Rentals" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
