import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { 
  Search, 
  Check, 
  X, 
  Clock, 
  DollarSign, 
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useApproveOffer, useRejectOffer, useMarkPurchaseCompleted } from "@/hooks/useOfferApprovals";
import ApprovalActionModal from "@/components/admin/offers/ApprovalActionModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface OfferWithInventory {
  id: string;
  customer_name: string;
  customer_company: string | null;
  customer_email: string;
  offer_amount: number;
  list_price: number | null;
  margin_percentage: number | null;
  reason: string | null;
  status: string | null;
  created_at: string;
  approved_at: string | null;
  requires_approval: boolean | null;
  offer_type: string | null;
  created_by_email: string | null;
  inventory: {
    product_name: string;
    oem: string;
    modality: string;
  } | null;
}

type SortField = "created_at" | "offer_amount" | "discount" | "margin";
type SortDirection = "asc" | "desc";

const OfferApprovals = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedOffer, setSelectedOffer] = useState<OfferWithInventory | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedOffers, setSelectedOffers] = useState<Set<string>>(new Set());
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const queryClient = useQueryClient();
  const approveOffer = useApproveOffer();
  const rejectOffer = useRejectOffer();
  const markPurchased = useMarkPurchaseCompleted();

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["all-offers", activeTab],
    queryFn: async (): Promise<OfferWithInventory[]> => {
      let query = supabase
        .from("product_offers")
        .select(`
          id,
          customer_name,
          customer_company,
          customer_email,
          offer_amount,
          list_price,
          margin_percentage,
          reason,
          status,
          created_at,
          approved_at,
          requires_approval,
          offer_type,
          created_by_email,
          inventory:inventory_id (
            product_name,
            oem,
            modality
          )
        `)
        .order("created_at", { ascending: false });

      if (activeTab === "pending") {
        query = query.eq("status", "pending").eq("requires_approval", true);
      } else if (activeTab === "approved") {
        query = query.eq("status", "approved");
      } else if (activeTab === "rejected") {
        query = query.eq("status", "rejected");
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        inventory: item.inventory as { product_name: string; oem: string; modality: string } | null
      }));
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDiscountPercent = (offer: OfferWithInventory) => {
    if (!offer.list_price) return null;
    return Math.round(((offer.list_price - offer.offer_amount) / offer.list_price) * 100);
  };

  const filteredOffers = offers.filter(offer => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      offer.customer_name.toLowerCase().includes(query) ||
      offer.customer_company?.toLowerCase().includes(query) ||
      offer.inventory?.product_name.toLowerCase().includes(query) ||
      offer.inventory?.oem.toLowerCase().includes(query)
    );
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "created_at":
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case "offer_amount":
        comparison = a.offer_amount - b.offer_amount;
        break;
      case "discount":
        comparison = (getDiscountPercent(a) || 0) - (getDiscountPercent(b) || 0);
        break;
      case "margin":
        comparison = (a.margin_percentage || 0) - (b.margin_percentage || 0);
        break;
    }
    return sortDirection === "desc" ? -comparison : comparison;
  });

  // Only show pending offers in selection
  const selectableOffers = sortedOffers.filter(o => o.status === "pending" && o.requires_approval);

  const handleAction = (offer: OfferWithInventory, action: "approve" | "reject") => {
    setSelectedOffer(offer);
    setActionType(action);
  };

  const handleConfirmAction = (notes?: string) => {
    if (!selectedOffer || !actionType) return;

    if (actionType === "approve") {
      approveOffer.mutate({ offerId: selectedOffer.id, notes });
    } else {
      rejectOffer.mutate({ offerId: selectedOffer.id, reason: notes });
    }

    setSelectedOffer(null);
    setActionType(null);
  };

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOffers(new Set(selectableOffers.map(o => o.id)));
    } else {
      setSelectedOffers(new Set());
    }
  };

  const handleSelectOffer = (offerId: string, checked: boolean) => {
    const newSelected = new Set(selectedOffers);
    if (checked) {
      newSelected.add(offerId);
    } else {
      newSelected.delete(offerId);
    }
    setSelectedOffers(newSelected);
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    if (selectedOffers.size === 0) return;

    setBulkProcessing(true);
    const offerIds = Array.from(selectedOffers);
    let successCount = 0;
    let failCount = 0;

    for (const offerId of offerIds) {
      try {
        if (action === "approve") {
          await approveOffer.mutateAsync({ offerId, notes: "Bulk approved" });
        } else {
          await rejectOffer.mutateAsync({ offerId, reason: "Bulk rejected" });
        }
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to ${action} offer ${offerId}:`, error);
      }
    }

    setBulkProcessing(false);
    setSelectedOffers(new Set());
    
    if (failCount === 0) {
      toast.success(`Successfully ${action}d ${successCount} offers`);
    } else {
      toast.warning(`${action === "approve" ? "Approved" : "Rejected"} ${successCount} offers, ${failCount} failed`);
    }

    queryClient.invalidateQueries({ queryKey: ["all-offers"] });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingCount = offers.filter(o => o.status === "pending" && o.requires_approval).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offer Approvals</h1>
          <p className="text-muted-foreground">Review and manage product offers requiring approval</p>
        </div>
        {pendingCount > 0 && activeTab !== "pending" && (
          <Button 
            variant="outline" 
            className="border-amber-300 text-amber-700"
            onClick={() => setActiveTab("pending")}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {pendingCount} Pending
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingCount > 0 && (
                    <Badge className="ml-2 h-5 px-1.5 bg-amber-500 text-white">{pendingCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
                <SelectTrigger className="w-40">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date</SelectItem>
                  <SelectItem value="offer_amount">Amount</SelectItem>
                  <SelectItem value="discount">Discount %</SelectItem>
                  <SelectItem value="margin">Margin %</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDirection(d => d === "asc" ? "desc" : "asc")}
              >
                {sortDirection === "desc" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Bulk Action Bar */}
          {selectedOffers.size > 0 && (
            <div className="flex items-center gap-4 p-3 mb-4 bg-muted rounded-lg border">
              <span className="text-sm font-medium">{selectedOffers.size} selected</span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleBulkAction("approve")}
                  disabled={bulkProcessing}
                >
                  {bulkProcessing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                  Approve All
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleBulkAction("reject")}
                  disabled={bulkProcessing}
                >
                  {bulkProcessing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                  Reject All
                </Button>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setSelectedOffers(new Set())}
                disabled={bulkProcessing}
              >
                Clear Selection
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : sortedOffers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No offers found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {activeTab === "pending" && (
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selectableOffers.length > 0 && selectedOffers.size === selectableOffers.length}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      />
                    </TableHead>
                  )}
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Offer</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOffers.map((offer) => {
                  const discount = getDiscountPercent(offer);
                  const isExpanded = expandedRows.has(offer.id);
                  const isSelectable = offer.status === "pending" && offer.requires_approval;

                  return (
                    <Collapsible key={offer.id} asChild open={isExpanded}>
                      <>
                        <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRowExpand(offer.id)}>
                          {activeTab === "pending" && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              {isSelectable && (
                                <Checkbox
                                  checked={selectedOffers.has(offer.id)}
                                  onCheckedChange={(checked) => handleSelectOffer(offer.id, !!checked)}
                                />
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </CollapsibleTrigger>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{offer.customer_name}</p>
                              {offer.customer_company && (
                                <p className="text-xs text-muted-foreground">{offer.customer_company}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {offer.inventory ? (
                              <div>
                                <p className="font-medium text-sm">{offer.inventory.product_name}</p>
                                <p className="text-xs text-muted-foreground">{offer.inventory.oem}</p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(offer.offer_amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {discount !== null ? (
                              <span className={discount > 20 ? "text-red-600 font-medium" : discount > 15 ? "text-amber-600" : ""}>
                                {discount}%
                              </span>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {offer.margin_percentage !== null ? (
                              <span className={offer.margin_percentage < 15 ? "text-red-600 font-medium" : "text-green-600"}>
                                {offer.margin_percentage.toFixed(1)}%
                              </span>
                            ) : "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(offer.status)}</TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell className="text-right">
                            {offer.status === "pending" && offer.requires_approval ? (
                              <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-red-600 border-red-300 hover:bg-red-50"
                                  onClick={() => handleAction(offer, "reject")}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-7 bg-green-600 hover:bg-green-700"
                                  onClick={() => handleAction(offer, "approve")}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : offer.status === "approved" ? (
                              <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7"
                                  onClick={() => markPurchased.mutate(offer.id)}
                                  disabled={markPurchased.isPending}
                                >
                                  {markPurchased.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                                  Purchased
                                </Button>
                              </div>
                            ) : null}
                          </TableCell>
                        </TableRow>
                        <CollapsibleContent asChild>
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={activeTab === "pending" ? 10 : 9} className="py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground text-xs mb-1">List Price</p>
                                  <p className="font-medium">{offer.list_price ? formatCurrency(offer.list_price) : "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs mb-1">Offer Type</p>
                                  <p className="font-medium capitalize">{offer.offer_type || "Soft"}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs mb-1">Created By</p>
                                  <p className="font-medium">{offer.created_by_email || "Unknown"}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs mb-1">Customer Email</p>
                                  <p className="font-medium">{offer.customer_email}</p>
                                </div>
                                {offer.reason && (
                                  <div className="col-span-2 md:col-span-4">
                                    <p className="text-muted-foreground text-xs mb-1">Reason / Notes</p>
                                    <p className="font-medium">{offer.reason}</p>
                                  </div>
                                )}
                                {offer.approved_at && (
                                  <div>
                                    <p className="text-muted-foreground text-xs mb-1">Decision Date</p>
                                    <p className="font-medium">{format(new Date(offer.approved_at), "MMM d, yyyy h:mm a")}</p>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ApprovalActionModal
        open={!!selectedOffer && !!actionType}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOffer(null);
            setActionType(null);
          }
        }}
        offer={selectedOffer}
        actionType={actionType}
        onConfirm={handleConfirmAction}
        isLoading={approveOffer.isPending || rejectOffer.isPending}
      />
    </div>
  );
};

export default OfferApprovals;
