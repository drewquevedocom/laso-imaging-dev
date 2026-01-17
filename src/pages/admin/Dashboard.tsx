import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Users, 
  Flame, 
  Wrench, 
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatEquipmentText } from "@/lib/utils";
import {
  useDashboardStats,
  useLeadsByWeek,
  useLeadsBySource,
  useRecentLeads,
  useRecentTickets,
} from "@/hooks/useAdminDashboardData";
import LeadTriageBoard from "@/components/admin/LeadTriageBoard";
import HotListWidget from "@/components/admin/HotListWidget";
const CHART_COLORS = [
  "hsl(209, 100%, 45%)",
  "hsl(209, 69%, 55%)",
  "hsl(160, 70%, 40%)",
  "hsl(35, 100%, 50%)",
  "hsl(0, 84%, 60%)",
];

const chartConfig = {
  leads: {
    label: "Leads",
    color: "hsl(209, 100%, 45%)",
  },
};

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: leadsByWeek = [], isLoading: weekLoading } = useLeadsByWeek();
  const { data: leadsBySource = [], isLoading: sourceLoading } = useLeadsBySource();
  const { data: recentLeads = [], isLoading: leadsLoading } = useRecentLeads();
  const { data: recentTickets = [], isLoading: ticketsLoading } = useRecentTickets();

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const kpiCards = [
    {
      title: "Total Leads",
      value: stats?.totalLeads || 0,
      icon: Users,
      trend: "+12%",
      trendUp: true,
      color: "text-primary",
      bgColor: "bg-primary/10",
      link: "/admin/notifications",
    },
    {
      title: "Hot Leads",
      value: stats?.hotLeads || 0,
      icon: Flame,
      trend: "+5",
      trendUp: true,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      link: "/admin/notifications?filter=hot",
    },
    {
      title: "Available Equipment",
      value: stats?.availableEquipment || 0,
      icon: Package,
      trend: "In stock",
      trendUp: true,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      link: "/admin/search",
    },
    {
      title: "Quote Pipeline",
      value: formatCurrency(stats?.quotePipeline || 0),
      icon: DollarSign,
      trend: "Active",
      trendUp: true,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      link: "/admin/quotes",
    },
    {
      title: "Open Tickets",
      value: stats?.openTickets || 0,
      icon: Wrench,
      trend: "-3",
      trendUp: false,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/admin/dashboard",
    },
    {
      title: "Pending Quotes",
      value: stats?.pendingQuotes || 0,
      icon: FileText,
      trend: "+8",
      trendUp: true,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/admin/quotes?status=Draft",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      contacted: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      qualified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "in-progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return statusStyles[status] || statusStyles.new;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles: Record<string, string> = {
      high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return priorityStyles[priority] || priorityStyles.medium;
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's an overview of your {formatEquipmentText("MRI")} business.
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Live
            </Badge>
          </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {kpiCards.map((card) => (
            <Link key={card.title} to={card.link}>
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statsLoading ? "..." : card.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {card.trendUp ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm text-green-500">{card.trend}</span>
                    <span className="text-sm text-muted-foreground">vs last week</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Lead Triage Kanban Board */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Triage Board</CardTitle>
            <CardDescription>Drag and drop leads to update their status</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadTriageBoard />
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Leads Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Leads Over Time</CardTitle>
              <CardDescription>Weekly lead generation for the past 6 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadsByWeek}>
                    <XAxis 
                      dataKey="week" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(209, 100%, 45%)" 
                      radius={[4, 4, 0, 0]}
                      name="leads"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Leads by Source */}
          <Card>
            <CardHeader>
              <CardTitle>Leads by Source</CardTitle>
              <CardDescription>Top 5 lead sources</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadsBySource}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="source"
                    >
                      {leadsBySource.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {leadsBySource.map((item, index) => (
                  <div key={item.source} className="flex items-center gap-1.5 text-sm">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="text-muted-foreground truncate max-w-[100px]">
                      {item.source}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest 5 leads received</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadsLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : recentLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No leads yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentLeads.map((lead) => (
                      <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link 
                            to={`/admin/notifications?lead=${lead.id}`}
                            className="hover:underline flex items-center gap-2"
                          >
                            {lead.is_hot && <Flame className="h-4 w-4 text-orange-500" />}
                            {lead.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {lead.company || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadge(lead.status)}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {lead.lead_score}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Service Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Service Tickets</CardTitle>
              <CardDescription>Latest 5 service tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket #</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : recentTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No tickets yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">
                          {ticket.ticket_number}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {ticket.equipment_type ? formatEquipmentText(ticket.equipment_type) : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadge(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getPriorityBadge(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hot List Widget - Pinned Right */}
      <div className="w-80 flex-shrink-0 hidden lg:block">
        <div className="sticky top-6">
          <HotListWidget />
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
