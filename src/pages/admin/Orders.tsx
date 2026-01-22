import { useState } from "react";
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  DollarSign, 
  Search, 
  MoreHorizontal,
  Bell,
  Pencil,
  Trash2,
  Eye,
  Copy,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders, useOrderStats, useUpdateOrderStatus, useDeleteOrder, Order } from "@/hooks/useOrders";
import { toast } from "sonner";
import { format } from "date-fns";

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-500" },
  { value: "in_transit", label: "In Transit", color: "bg-purple-500" },
  { value: "delivered", label: "Delivered", color: "bg-green-500" },
  { value: "installed", label: "Installed", color: "bg-emerald-600" },
];

const getStatusBadge = (status: string) => {
  const option = statusOptions.find(s => s.value === status);
  return (
    <Badge className={`${option?.color || "bg-gray-500"} text-white`}>
      {option?.label || status}
    </Badge>
  );
};

const formatCurrency = (amount: number | null) => {
  if (!amount) return "—";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updateModal, setUpdateModal] = useState<Order | null>(null);
  const [detailSheet, setDetailSheet] = useState<Order | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Order | null>(null);
  
  // Update modal form state
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [sendNotification, setSendNotification] = useState(true);
  
  const { data: orders, isLoading } = useOrders(statusFilter);
  const { data: stats } = useOrderStats();
  const updateMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();
  
  // Filter orders by search
  const filteredOrders = orders?.filter(order => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(query) ||
      order.customer_profiles?.contact_name?.toLowerCase().includes(query) ||
      order.customer_profiles?.company_name?.toLowerCase().includes(query) ||
      order.equipment_description?.toLowerCase().includes(query)
    );
  }) || [];
  
  const handleOpenUpdateModal = (order: Order) => {
    setUpdateModal(order);
    setNewStatus(order.status);
    setTrackingNumber(order.tracking_number || "");
    setNotes(order.notes || "");
    setSendNotification(true);
  };
  
  const handleUpdate = async () => {
    if (!updateModal) return;
    
    await updateMutation.mutateAsync({
      orderId: updateModal.id,
      newStatus,
      trackingNumber: trackingNumber || undefined,
      notes: notes || undefined,
      sendNotification,
    });
    
    setUpdateModal(null);
  };
  
  const handleQuickStatusUpdate = async (order: Order, newStatus: string, notify: boolean = true) => {
    await updateMutation.mutateAsync({
      orderId: order.id,
      newStatus,
      sendNotification: notify,
    });
  };
  
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteMutation.mutateAsync(deleteConfirm.id);
    setDeleteConfirm(null);
  };
  
  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Order number copied");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">Manage orders, update status, and notify customers</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.total || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats?.confirmed || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              In Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{stats?.inTransit || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats?.delivered || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(stats?.totalValue || 0)}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Equipment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Tracking</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{order.order_number}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyOrderNumber(order.order_number)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_profiles?.contact_name || "—"}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_profiles?.company_name || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {order.equipment_description || "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total_amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {order.tracking_number || (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => handleOpenUpdateModal(order)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setDetailSheet(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenUpdateModal(order)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Truck className="h-4 w-4 mr-2" />
                              Quick Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {statusOptions.map(status => (
                                <DropdownMenuItem
                                  key={status.value}
                                  disabled={order.status === status.value}
                                  onClick={() => handleQuickStatusUpdate(order, status.value)}
                                >
                                  {status.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem 
                            onClick={() => handleQuickStatusUpdate(order, order.status, true)}
                          >
                            <Bell className="h-4 w-4 mr-2" />
                            Notify Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeleteConfirm(order)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Update Status Modal */}
      <Dialog open={!!updateModal} onOpenChange={() => setUpdateModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Order: {updateModal?.order_number} • {updateModal?.customer_profiles?.contact_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tracking Number (optional)</Label>
              <Input
                placeholder="e.g., 1Z999AA10123456784"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any notes about this update..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify"
                checked={sendNotification}
                onCheckedChange={(checked) => setSendNotification(checked as boolean)}
              />
              <Label htmlFor="notify" className="cursor-pointer">
                Notify customer of this update (email + push notification)
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Order Detail Sheet */}
      <Sheet open={!!detailSheet} onOpenChange={() => setDetailSheet(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
            <SheetDescription>{detailSheet?.order_number}</SheetDescription>
          </SheetHeader>
          
          {detailSheet && (
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(detailSheet.status)}</div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{detailSheet.customer_profiles?.contact_name}</p>
                  <p className="text-sm text-muted-foreground">{detailSheet.customer_profiles?.company_name}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Equipment</Label>
                  <p>{detailSheet.equipment_description || "—"}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Total Amount</Label>
                  <p className="text-xl font-bold">{formatCurrency(detailSheet.total_amount)}</p>
                </div>
                
                {detailSheet.tracking_number && (
                  <div>
                    <Label className="text-muted-foreground">Tracking Number</Label>
                    <p className="font-mono">{detailSheet.tracking_number}</p>
                  </div>
                )}
                
                {detailSheet.estimated_delivery && (
                  <div>
                    <Label className="text-muted-foreground">Estimated Delivery</Label>
                    <p>{format(new Date(detailSheet.estimated_delivery), "PPP")}</p>
                  </div>
                )}
                
                {detailSheet.installation_date && (
                  <div>
                    <Label className="text-muted-foreground">Installation Date</Label>
                    <p>{format(new Date(detailSheet.installation_date), "PPP")}</p>
                  </div>
                )}
                
                {detailSheet.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="text-sm">{detailSheet.notes}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <Label className="text-muted-foreground">Timeline</Label>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Created:</span>{" "}
                      {format(new Date(detailSheet.created_at), "PPP 'at' p")}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>{" "}
                      {format(new Date(detailSheet.updated_at), "PPP 'at' p")}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setDetailSheet(null);
                    handleOpenUpdateModal(detailSheet);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickStatusUpdate(detailSheet, detailSheet.status, true)}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notify
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete order {deleteConfirm?.order_number}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
