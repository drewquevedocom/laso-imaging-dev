import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Mail, 
  Phone,
  Building,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  UserPlus,
  FileText,
} from "lucide-react";

interface SellRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  equipment_type: string;
  manufacturer: string | null;
  model: string | null;
  year_manufactured: number | null;
  condition: string | null;
  location: string | null;
  timeline: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" },
  contacted: { label: "Contacted", icon: Mail, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  evaluating: { label: "Evaluating", icon: TrendingUp, className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  closed: { label: "Closed", icon: CheckCircle, className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  declined: { label: "Declined", icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

const Customers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<SellRequest | null>(null);
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["sell-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment_sell_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as SellRequest[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("equipment_sell_requests")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sell-requests"] });
      toast.success("Status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  // Convert to Lead mutation
  const convertToLeadMutation = useMutation({
    mutationFn: async (request: SellRequest) => {
      const message = `
Equipment: ${request.equipment_type}
Manufacturer: ${request.manufacturer || 'Not specified'}
Model: ${request.model || 'Not specified'}
Year: ${request.year_manufactured || 'Not specified'}
Condition: ${request.condition || 'Not specified'}
Location: ${request.location || 'Not specified'}
Timeline: ${request.timeline || 'Not specified'}
Notes: ${request.message || 'None'}
      `.trim();

      const { error } = await supabase.from("leads").insert({
        name: request.name,
        email: request.email,
        phone: request.phone || null,
        company: request.company || null,
        interest: `Equipment Acquisition - ${request.equipment_type}`,
        message: message,
        source_page: "Converted from Sell Request",
        status: "new",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Converted to lead! View in Lead Triage.", {
        action: {
          label: "Go to Leads",
          onClick: () => navigate("/admin/notifications"),
        },
      });
    },
    onError: () => {
      toast.error("Failed to convert to lead");
    },
  });

  // Create Quote from sell request
  const handleCreateQuote = (request: SellRequest) => {
    sessionStorage.setItem("quoteCustomerPrefill", JSON.stringify({
      name: request.name,
      email: request.email,
      company: request.company || "",
      phone: request.phone || "",
    }));
    navigate("/admin/quote-builder");
    toast.success("Customer info loaded into Quote Builder");
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.name.toLowerCase().includes(search.toLowerCase()) ||
      request.email.toLowerCase().includes(search.toLowerCase()) ||
      request.equipment_type.toLowerCase().includes(search.toLowerCase()) ||
      (request.company?.toLowerCase().includes(search.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    contacted: requests.filter(r => r.status === "contacted").length,
    closed: requests.filter(r => r.status === "closed").length,
  };

  const getStatusBadge = (status: string | null) => {
    const config = statusConfig[status || "pending"] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={`gap-1 ${config.className}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sell Requests</h1>
        <p className="text-muted-foreground">Manage equipment sell inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contacted</p>
                <p className="text-2xl font-bold text-blue-600">{stats.contacted}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, company, or equipment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="evaluating">Evaluating</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No sell requests found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                          {request.company && (
                            <p className="text-xs text-muted-foreground">{request.company}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.equipment_type}</p>
                          {request.manufacturer && (
                            <p className="text-sm text-muted-foreground">
                              {request.manufacturer} {request.model && `- ${request.model}`}
                            </p>
                          )}
                          {request.year_manufactured && (
                            <p className="text-xs text-muted-foreground">Year: {request.year_manufactured}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.location || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedRequest(request)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: request.id, status: "contacted" })}>
                              <Mail className="h-4 w-4 mr-2" />
                              Mark Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: request.id, status: "evaluating" })}>
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Mark Evaluating
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: request.id, status: "closed" })}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Closed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => convertToLeadMutation.mutate(request)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Convert to Lead
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCreateQuote(request)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Create Quote
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedRequest && (
            <>
              <SheetHeader>
                <SheetTitle>Sell Request Details</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-lg">{selectedRequest.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${selectedRequest.email}`} className="text-primary hover:underline">
                        {selectedRequest.email}
                      </a>
                    </div>
                    {selectedRequest.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${selectedRequest.phone}`} className="text-primary hover:underline">
                          {selectedRequest.phone}
                        </a>
                      </div>
                    )}
                    {selectedRequest.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {selectedRequest.company}
                      </div>
                    )}
                  </div>
                </div>

                {/* Equipment Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Equipment Details</h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{selectedRequest.equipment_type}</span>
                    </div>
                    {selectedRequest.manufacturer && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Manufacturer</span>
                        <span className="font-medium">{selectedRequest.manufacturer}</span>
                      </div>
                    )}
                    {selectedRequest.model && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium">{selectedRequest.model}</span>
                      </div>
                    )}
                    {selectedRequest.year_manufactured && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-medium">{selectedRequest.year_manufactured}</span>
                      </div>
                    )}
                    {selectedRequest.condition && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condition</span>
                        <span className="font-medium">{selectedRequest.condition}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location & Timeline */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Location & Timeline</h3>
                  <div className="space-y-2">
                    {selectedRequest.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {selectedRequest.location}
                      </div>
                    )}
                    {selectedRequest.timeline && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {selectedRequest.timeline}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                {selectedRequest.message && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Message</h3>
                    <p className="text-sm whitespace-pre-wrap bg-muted/50 rounded-lg p-4">
                      {selectedRequest.message}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Status</h3>
                  <Select 
                    value={selectedRequest.status || "pending"} 
                    onValueChange={(value) => {
                      updateStatusMutation.mutate({ id: selectedRequest.id, status: value });
                      setSelectedRequest({ ...selectedRequest, status: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="evaluating">Evaluating</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => window.location.href = `mailto:${selectedRequest.email}`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  {selectedRequest.phone && (
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = `tel:${selectedRequest.phone}`}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Customers;
