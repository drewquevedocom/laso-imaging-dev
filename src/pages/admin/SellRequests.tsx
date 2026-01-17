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
  Truck,
  Building2,
  ScanLine,
  Activity,
  AlertTriangle,
  Camera,
  CalendarPlus,
  Zap,
} from "lucide-react";
import { PhotoGallery } from "@/components/admin/PhotoGallery";
import { ScheduleSiteVisitModal } from "@/components/admin/ScheduleSiteVisitModal";
import { EmailTemplateSelector } from "@/components/admin/EmailTemplateSelector";

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
  // New enhanced fields
  systems_count: number | null;
  has_mri: boolean | null;
  has_ct: boolean | null;
  is_mobile: boolean | null;
  mobile_units_count: number | null;
  trailer_included: boolean | null;
  mobile_status: string | null;
  magnet_strength: string | null;
  year_installed: number | null;
  equipment_status: string | null;
  daily_scan_volume: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  desired_price: string | null;
  facility_type: string | null;
  seller_role: string | null;
  deal_priority: string | null;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" },
  contacted: { label: "Contacted", icon: Mail, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  evaluating: { label: "Evaluating", icon: TrendingUp, className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  closed: { label: "Closed", icon: CheckCircle, className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  declined: { label: "Declined", icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  urgent: { label: "Urgent", className: "bg-red-500 text-white" },
  high: { label: "High", className: "bg-orange-500 text-white" },
  normal: { label: "Normal", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

const SellRequests = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalityFilter, setModalityFilter] = useState<string>("all");
  const [mobileFilter, setMobileFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
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
Systems Count: ${request.systems_count || 1}
Mobile: ${request.is_mobile ? 'Yes' : 'No'}
Magnet Strength: ${request.magnet_strength || 'N/A'}
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
        urgency: request.deal_priority === 'urgent' ? 'Emergency' : 'Normal',
        is_hot: request.deal_priority === 'urgent',
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

  const sendAssetRequestMutation = useMutation({
    mutationFn: async (request: SellRequest) => {
      const { data, error } = await supabase.functions.invoke('send-asset-request', {
        body: { sellRequestId: request.id },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sell-requests"] });
      toast.success("Photo/video request email sent successfully!");
    },
    onError: (error) => {
      console.error("Failed to send asset request:", error);
      toast.error("Failed to send email. Please try again.");
    },
  });

  const handleRequestPhotos = (request: SellRequest) => {
    sendAssetRequestMutation.mutate(request);
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.name.toLowerCase().includes(search.toLowerCase()) ||
      request.email.toLowerCase().includes(search.toLowerCase()) ||
      request.equipment_type.toLowerCase().includes(search.toLowerCase()) ||
      (request.company?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (request.model?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (request.manufacturer?.toLowerCase().includes(search.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    const matchesModality = modalityFilter === "all" || 
      (modalityFilter === "mri" && request.has_mri) ||
      (modalityFilter === "ct" && request.has_ct) ||
      (modalityFilter === "both" && request.has_mri && request.has_ct);
    
    const matchesMobile = mobileFilter === "all" || 
      (mobileFilter === "mobile" && request.is_mobile) ||
      (mobileFilter === "fixed" && !request.is_mobile);
    
    const matchesPriority = priorityFilter === "all" || request.deal_priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesModality && matchesMobile && matchesPriority;
  });

  // Enhanced stats
  const stats = {
    total: requests.length,
    mri: requests.filter(r => r.has_mri).length,
    ct: requests.filter(r => r.has_ct).length,
    mobile: requests.filter(r => r.is_mobile).length,
    urgent: requests.filter(r => r.deal_priority === 'urgent').length,
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

  const getPriorityBadge = (priority: string | null) => {
    const config = priorityConfig[priority || "normal"] || priorityConfig.normal;
    return (
      <Badge className={config.className}>
        {priority === 'urgent' && <Zap className="h-3 w-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  const getModalityBadge = (request: SellRequest) => {
    if (request.has_mri && request.has_ct) {
      return (
        <div className="flex gap-1">
          <Badge variant="outline" className="gap-1 text-xs">
            <ScanLine className="h-3 w-3" /> MRI
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs">
            <Activity className="h-3 w-3" /> CT
          </Badge>
        </div>
      );
    }
    if (request.has_mri) {
      return (
        <Badge variant="outline" className="gap-1">
          <ScanLine className="h-3 w-3" /> MRI
        </Badge>
      );
    }
    if (request.has_ct) {
      return (
        <Badge variant="outline" className="gap-1">
          <Activity className="h-3 w-3" /> CT
        </Badge>
      );
    }
    return <span className="text-muted-foreground text-sm">{request.equipment_type}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">MRI/CT Manage</h1>
        <p className="text-muted-foreground">Manage MRI & CT equipment acquisition inquiries</p>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-muted-foreground">MRI</p>
                <p className="text-2xl font-bold text-blue-600">{stats.mri}</p>
              </div>
              <ScanLine className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CT</p>
                <p className="text-2xl font-bold text-purple-600">{stats.ct}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p className="text-2xl font-bold text-green-600">{stats.mobile}</p>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, company, model, or manufacturer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
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

              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Modality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mri">MRI Only</SelectItem>
                  <SelectItem value="ct">CT Only</SelectItem>
                  <SelectItem value="both">MRI & CT</SelectItem>
                </SelectContent>
              </Select>

              <Select value={mobileFilter} onValueChange={setMobileFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Installation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow 
                      key={request.id} 
                      className={`cursor-pointer hover:bg-muted/50 ${
                        request.deal_priority === 'urgent' ? 'bg-red-50 dark:bg-red-950/20' : ''
                      }`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-lg">{request.systems_count || 1}</span>
                          {request.is_mobile && <Truck className="h-4 w-4 text-green-600" />}
                        </div>
                      </TableCell>
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
                          <p className="font-medium">
                            {request.manufacturer || 'Unknown OEM'} {request.model && `- ${request.model}`}
                          </p>
                          {request.year_manufactured && (
                            <p className="text-xs text-muted-foreground">Year: {request.year_manufactured}</p>
                          )}
                          {request.magnet_strength && (
                            <Badge variant="secondary" className="text-xs mt-1">{request.magnet_strength}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getModalityBadge(request)}
                      </TableCell>
                      <TableCell>
                        {request.timeline ? (
                          <Badge variant={request.timeline === 'Immediately' ? 'destructive' : 'outline'}>
                            {request.timeline}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(request.deal_priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedRequest(request); }}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${request.phone}`; }}>
                              <Phone className="h-4 w-4 mr-2" />
                              Call Now
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${request.email}`; }}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRequestPhotos(request); }}>
                              <Camera className="h-4 w-4 mr-2" />
                              Request Photos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: request.id, status: "contacted" }); }}>
                              <Mail className="h-4 w-4 mr-2" />
                              Mark Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: request.id, status: "evaluating" }); }}>
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Mark Evaluating
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: request.id, status: "closed" }); }}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Closed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); convertToLeadMutation.mutate(request); }}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Convert to Lead
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCreateQuote(request); }}>
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

      {/* Enhanced Detail Sheet */}
      <Sheet open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          {selectedRequest && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <SheetTitle>Sell Request Details</SheetTitle>
                  {getPriorityBadge(selectedRequest.deal_priority)}
                </div>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <p className="text-2xl font-bold">{selectedRequest.systems_count || 1}</p>
                      <p className="text-xs text-muted-foreground">Systems</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        {selectedRequest.has_mri && <ScanLine className="h-5 w-5 text-blue-500" />}
                        {selectedRequest.has_ct && <Activity className="h-5 w-5 text-purple-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedRequest.has_mri && selectedRequest.has_ct ? 'MRI & CT' : 
                         selectedRequest.has_mri ? 'MRI' : 
                         selectedRequest.has_ct ? 'CT' : selectedRequest.equipment_type}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      {selectedRequest.is_mobile ? (
                        <>
                          <Truck className="h-5 w-5 mx-auto text-green-500" />
                          <p className="text-xs text-muted-foreground mt-1">Mobile</p>
                        </>
                      ) : (
                        <>
                          <Building2 className="h-5 w-5 mx-auto text-gray-500" />
                          <p className="text-xs text-muted-foreground mt-1">Fixed</p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-lg">{selectedRequest.name}</p>
                    {selectedRequest.seller_role && (
                      <p className="text-sm text-muted-foreground capitalize">{selectedRequest.seller_role.replace('-', ' ')}</p>
                    )}
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
                        {selectedRequest.facility_type && (
                          <span className="text-muted-foreground">({selectedRequest.facility_type})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Equipment Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Equipment Details</h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manufacturer</span>
                      <span className="font-medium">{selectedRequest.manufacturer || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{selectedRequest.model || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year Manufactured</span>
                      <span className="font-medium">{selectedRequest.year_manufactured || '—'}</span>
                    </div>
                    {selectedRequest.year_installed && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year Installed</span>
                        <span className="font-medium">{selectedRequest.year_installed}</span>
                      </div>
                    )}
                    {selectedRequest.magnet_strength && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Magnet Strength</span>
                        <Badge variant="secondary">{selectedRequest.magnet_strength}</Badge>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-medium">{selectedRequest.condition || '—'}</span>
                    </div>
                    {selectedRequest.equipment_status && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium capitalize">{selectedRequest.equipment_status.replace('-', ' ')}</span>
                      </div>
                    )}
                    {selectedRequest.daily_scan_volume && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Daily Volume</span>
                        <span className="font-medium">{selectedRequest.daily_scan_volume}</span>
                      </div>
                    )}
                  </div>

                  {/* Mobile Details */}
                  {selectedRequest.is_mobile && (
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 space-y-2 text-sm border border-green-200 dark:border-green-900">
                      <h4 className="font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                        <Truck className="h-4 w-4" /> Mobile Unit Details
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mobile Units</span>
                        <span className="font-medium">{selectedRequest.mobile_units_count || 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trailer Included</span>
                        <span className="font-medium">{selectedRequest.trailer_included ? 'Yes' : selectedRequest.trailer_included === false ? 'No' : '—'}</span>
                      </div>
                      {selectedRequest.mobile_status && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mobile Status</span>
                          <span className="font-medium capitalize">{selectedRequest.mobile_status.replace('-', ' ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Location & Timeline */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Location & Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {[selectedRequest.city, selectedRequest.state, selectedRequest.country].filter(Boolean).join(', ') || selectedRequest.location || '—'}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Timeline: <strong>{selectedRequest.timeline || '—'}</strong>
                    </div>
                    {selectedRequest.desired_price && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Desired Price:</span>
                        <strong>{selectedRequest.desired_price}</strong>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Submitted: {format(new Date(selectedRequest.created_at), "PPP 'at' p")}
                    </div>
                  </div>
                </div>

                {/* Message */}
                {selectedRequest.message && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Additional Notes</h3>
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

                {/* Photo Gallery */}
                <div className="space-y-3 pt-4 border-t">
                  <PhotoGallery sellRequestId={selectedRequest.id} />
                </div>

                {/* Quick Actions */}
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRequest.phone && (
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = `tel:${selectedRequest.phone}`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = `mailto:${selectedRequest.email}`}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleRequestPhotos(selectedRequest)}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Request Photos
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(null);
                        convertToLeadMutation.mutate(selectedRequest);
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Convert to Lead
                    </Button>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setSelectedRequest(null);
                      handleCreateQuote(selectedRequest);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Create Quote from Request
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SellRequests;
