import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Send,
  Eye,
  Copy,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  useQuotes,
  useCreateQuote,
  useUpdateQuote,
  useDeleteQuote,
  useQuotesStats,
} from "@/hooks/useQuotes";
import { useQuoteEmailStatuses } from "@/hooks/useEmailDeliveryStatus";
import { EmailTrackingBadge } from "@/components/admin/EmailTrackingBadge";
import { Quote, QuoteLineItem } from "@/types/database";
import { format } from "date-fns";
import SendQuoteModal from "@/components/admin/SendQuoteModal";

const STATUS_OPTIONS = ["Draft", "Sent", "Viewed", "Accepted", "Rejected", "Expired"];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    Sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Viewed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    Accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Expired: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
  return styles[status] || styles.Draft;
};

const AdminQuotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sendQuoteModalOpen, setSendQuoteModalOpen] = useState(false);
  const [quoteToSend, setQuoteToSend] = useState<Quote | null>(null);

  const { data: quotes = [], isLoading } = useQuotes();
  const { data: stats } = useQuotesStats();
  const createQuote = useCreateQuote();
  const updateQuote = useUpdateQuote();
  const deleteQuote = useDeleteQuote();
  
  // Get email statuses for all quotes
  const quoteIds = useMemo(() => quotes.map(q => q.id), [quotes]);
  const { data: emailStatuses = {} } = useQuoteEmailStatuses(quoteIds);

  // Form state
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_company: "",
    customer_phone: "",
    notes: "",
    internal_notes: "",
    valid_until: "",
    items: [{ id: crypto.randomUUID(), description: "", quantity: 1, unit_price: 0, total: 0 }] as QuoteLineItem[],
  });

  const resetForm = () => {
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_company: "",
      customer_phone: "",
      notes: "",
      internal_notes: "",
      valid_until: "",
      items: [{ id: crypto.randomUUID(), description: "", quantity: 1, unit_price: 0, total: 0 }],
    });
  };

  const handleAddLineItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: crypto.randomUUID(), description: "", quantity: 1, unit_price: 0, total: 0 }],
    });
  };

  const handleRemoveLineItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((item) => item.id !== id),
      });
    }
  };

  const handleUpdateLineItem = (id: string, field: keyof QuoteLineItem, value: string | number) => {
    setFormData({
      ...formData,
      items: formData.items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unit_price") {
            updated.total = updated.quantity * updated.unit_price;
          }
          return updated;
        }
        return item;
      }),
    });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    return { subtotal, discount: 0, tax: 0, total: subtotal };
  };

  const handleSubmit = async () => {
    const totals = calculateTotals();
    const data = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_company: formData.customer_company || undefined,
      customer_phone: formData.customer_phone || undefined,
      notes: formData.notes || undefined,
      internal_notes: formData.internal_notes || undefined,
      valid_until: formData.valid_until || undefined,
      items: formData.items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total_amount: totals.total,
      status: "Draft" as const,
    };

    await createQuote.mutateAsync(data);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this quote?")) {
      await deleteQuote.mutateAsync(id);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateQuote.mutateAsync({ 
      id, 
      status: status as Quote["status"],
      ...(status === "Sent" && { sent_at: new Date().toISOString() }),
    });
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsSheetOpen(true);
  };

  const handleOpenSendModal = (quote: Quote) => {
    setQuoteToSend(quote);
    setSendQuoteModalOpen(true);
  };

  // Filter quotes
  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customer_company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totals = calculateTotals();

  return (
    <>
      <Helmet>
        <title>Quotes | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quotes Management</h1>
            <p className="text-muted-foreground">
              Create, track, and manage customer quotes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                New Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Quote</DialogTitle>
                <DialogDescription>
                  Build a quote for a customer
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">Name *</Label>
                      <Input
                        id="customer_name"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_email">Email *</Label>
                      <Input
                        id="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        placeholder="john@hospital.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_company">Company</Label>
                      <Input
                        id="customer_company"
                        value={formData.customer_company}
                        onChange={(e) => setFormData({ ...formData, customer_company: e.target.value })}
                        placeholder="ABC Hospital"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_phone">Phone</Label>
                      <Input
                        id="customer_phone"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Line Items</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddLineItem}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                        <div className="col-span-5">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleUpdateLineItem(item.id, "description", e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleUpdateLineItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Unit Price"
                            value={item.unit_price}
                            onChange={(e) => handleUpdateLineItem(item.id, "unit_price", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            readOnly
                            value={formatCurrency(item.total)}
                            className="bg-muted"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveLineItem(item.id)}
                            disabled={formData.items.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <div className="text-right space-y-1">
                      <div className="text-sm text-muted-foreground">Subtotal: {formatCurrency(totals.subtotal)}</div>
                      <div className="text-lg font-bold">Total: {formatCurrency(totals.total)}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Customer Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Notes visible to customer..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="internal_notes">Internal Notes</Label>
                    <Textarea
                      id="internal_notes"
                      value={formData.internal_notes}
                      onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                      placeholder="Internal notes (not visible to customer)..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valid_until">Valid Until</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.customer_name || !formData.customer_email}>
                  Create Quote
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                Drafts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.draft || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Send className="h-4 w-4 text-blue-500" />
                Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.sent || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(stats?.totalValue || 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by quote #, customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotes Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading quotes...
                    </TableCell>
                  </TableRow>
                ) : filteredQuotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {quotes.length === 0 ? "No quotes yet" : "No quotes match filters"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-mono font-medium">{quote.quote_number}</TableCell>
                      <TableCell>
                        <div className="font-medium">{quote.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{quote.customer_email}</div>
                      </TableCell>
                      <TableCell>{quote.customer_company || "—"}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(quote.total_amount)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadge(quote.status)}>
                            {quote.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <EmailTrackingBadge 
                              status={quote.status}
                              eventType={emailStatuses[quote.id]?.event_type}
                              timestamp={emailStatuses[quote.id]?.created_at}
                            />
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                        {format(new Date(quote.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewQuote(quote)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenSendModal(quote)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Generate & Send
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "Sent")}>
                              <Send className="h-4 w-4 mr-2" />
                              Mark as Sent
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "Accepted")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Accepted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "Rejected")}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Mark Rejected
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(quote.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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
      </div>

      {/* Quote Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[500px] sm:max-w-lg overflow-y-auto">
          {selectedQuote && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selectedQuote.quote_number}
                  <Badge variant="secondary" className={getStatusBadge(selectedQuote.status)}>
                    {selectedQuote.status}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  Created {format(new Date(selectedQuote.created_at), "MMMM d, yyyy")}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Customer</h4>
                  <div className="text-sm">
                    <p className="font-medium">{selectedQuote.customer_name}</p>
                    {selectedQuote.customer_company && <p>{selectedQuote.customer_company}</p>}
                    <p className="text-muted-foreground">{selectedQuote.customer_email}</p>
                    {selectedQuote.customer_phone && (
                      <p className="text-muted-foreground">{selectedQuote.customer_phone}</p>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Line Items</h4>
                  <div className="space-y-2">
                    {selectedQuote.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.description} × {item.quantity}
                        </span>
                        <span className="font-medium">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(selectedQuote.subtotal)}</span>
                  </div>
                  {selectedQuote.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span>-{formatCurrency(selectedQuote.discount)}</span>
                    </div>
                  )}
                  {selectedQuote.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(selectedQuote.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(selectedQuote.total_amount)}</span>
                  </div>
                </div>
                {selectedQuote.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">{selectedQuote.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <SendQuoteModal
        quote={quoteToSend}
        open={sendQuoteModalOpen}
        onOpenChange={setSendQuoteModalOpen}
        onSuccess={() => {
          setSendQuoteModalOpen(false);
          setQuoteToSend(null);
        }}
      />
    </>
  );
};

export default AdminQuotes;
