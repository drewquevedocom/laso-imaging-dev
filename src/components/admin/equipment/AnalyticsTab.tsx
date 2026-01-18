import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FileText,
  Percent,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { 
  useAcquisitionMetrics, 
  useAcquisitionsByWeek, 
  useInventoryMetrics, 
  useRentalMetrics,
  useRentalsByMonth,
} from "@/hooks/useEquipmentAnalytics";
import {
  useQuoteAnalytics,
  useOfferAnalytics,
  useQuotesByWeek,
  useOffersByModality,
} from "@/hooks/useSalesAnalytics";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsTab() {
  const { data: acquisitionMetrics } = useAcquisitionMetrics();
  const { data: acquisitionsByWeek } = useAcquisitionsByWeek();
  const { data: inventoryMetrics } = useInventoryMetrics();
  const { data: rentalMetrics } = useRentalMetrics();
  const { data: rentalsByMonth } = useRentalsByMonth();
  
  // Sales analytics
  const { data: quoteAnalytics } = useQuoteAnalytics();
  const { data: offerAnalytics } = useOfferAnalytics();
  const { data: quotesByWeek } = useQuotesByWeek();
  const { data: offersByModality } = useOffersByModality();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Quote Performance */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Quote Performance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Quotes</p>
              <p className="text-2xl font-bold">{quoteAnalytics?.total || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Sent</p>
              <p className="text-2xl font-bold text-blue-600">{quoteAnalytics?.sent || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Accepted</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{quoteAnalytics?.accepted || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-900">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-600">{quoteAnalytics?.conversionRate || 0}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-1">
                <Percent className="h-4 w-4 text-orange-500" />
                <p className="text-sm text-muted-foreground">Avg Discount</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">{quoteAnalytics?.avgDiscount || 0}%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Offer Performance */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Offer Performance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Offers</p>
              <p className="text-2xl font-bold">{offerAnalytics?.total || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-yellow-500" />
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{offerAnalytics?.pending || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Accepted</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{offerAnalytics?.accepted || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-900">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Acceptance Rate</p>
              <p className="text-2xl font-bold text-green-600">{offerAnalytics?.acceptanceRate || 0}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-muted-foreground">Avg Margin</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{offerAnalytics?.avgMargin || 0}%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quote/Offer Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quotes by Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quotesByWeek || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="quotes" stroke="#3b82f6" strokeWidth={2} name="Created" />
                <Line type="monotone" dataKey="accepted" stroke="#10b981" strokeWidth={2} name="Accepted" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Offers by Modality</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={offersByModality || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, acceptanceRate }) => `${name}: ${value} (${acceptanceRate}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(offersByModality || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, "Offers"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
