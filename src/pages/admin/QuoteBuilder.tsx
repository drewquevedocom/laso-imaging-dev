import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Plus,
  Trash2,
  Eye,
  ShoppingCart,
  Package,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInventory } from "@/hooks/useInventory";
import { useCreateQuote } from "@/hooks/useQuotes";
import { toast } from "sonner";
import QuotePreviewModal from "@/components/admin/QuotePreviewModal";

interface QuoteItem {
  id: string;
  inventoryId: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  originalPrice: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

const QuoteBuilder = () => {
  const { data: inventory = [], isLoading: inventoryLoading } = useInventory();
  const createQuote = useCreateQuote();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalityFilter, setModalityFilter] = useState<string>("all");
  const [oemFilter, setOemFilter] = useState<string>("all");

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  const [items, setItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Get unique modalities and OEMs from inventory
  const modalities = useMemo(() => {
    const mods = new Set(inventory.map((item) => item.modality).filter(Boolean));
    return Array.from(mods);
  }, [inventory]);

  const oems = useMemo(() => {
    const oemSet = new Set(inventory.map((item) => item.oem).filter(Boolean));
    return Array.from(oemSet);
  }, [inventory]);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.oem?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModality = modalityFilter === "all" || item.modality === modalityFilter;
      const matchesOem = oemFilter === "all" || item.oem === oemFilter;
      const isAvailable = item.availability_status === "Available";
      return matchesSearch && matchesModality && matchesOem && isAvailable;
    });
  }, [inventory, searchQuery, modalityFilter, oemFilter]);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const discountAmount = discount;
    const tax = 0; // Could add tax calculation
    const total = subtotal - discountAmount + tax;
    return { subtotal, discount: discountAmount, tax, total };
  }, [items, discount]);

  const handleAddItem = (inventoryItem: typeof inventory[0]) => {
    // Check if already in quote
    if (items.some((item) => item.inventoryId === inventoryItem.id)) {
      toast.info("Item already in quote");
      return;
    }

    const newItem: QuoteItem = {
      id: crypto.randomUUID(),
      inventoryId: inventoryItem.id,
      name: inventoryItem.product_name || "Untitled",
      description: `${inventoryItem.oem} ${inventoryItem.modality || ""}`.trim(),
      quantity: 1,
      unitPrice: inventoryItem.price || 0,
      originalPrice: inventoryItem.price || 0,
    };

    setItems([...items, newItem]);
    toast.success("Added to quote");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: "quantity" | "unitPrice", value: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleGenerateQuote = async () => {
    if (!customer.name || !customer.email) {
      toast.error("Please enter customer name and email");
      return;
    }
    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const quoteData = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_company: customer.company || undefined,
      customer_phone: customer.phone || undefined,
      notes: notes || undefined,
      items: items.map((item) => ({
        id: item.id,
        description: `${item.name} - ${item.description}`,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total_amount: totals.total,
      status: "Draft" as const,
    };

    await createQuote.mutateAsync(quoteData);
    
    // Reset form
    setCustomer({ name: "", email: "", company: "", phone: "" });
    setItems([]);
    setNotes("");
    setDiscount(0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const quotePreviewData = {
    customer,
    items,
    notes,
    totals,
  };

  return (
    <>
      <Helmet>
        <title>Quote Builder | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quote Builder</h1>
            <p className="text-muted-foreground">
              Build quotes from inventory items
            </p>
          </div>
          <Button variant="outline" disabled>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Product Search */}
          <Card className="h-[calc(100vh-220px)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Search
              </CardTitle>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={modalityFilter} onValueChange={setModalityFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Modality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modalities</SelectItem>
                      {modalities.map((mod) => (
                        <SelectItem key={mod} value={mod!}>
                          {mod}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={oemFilter} onValueChange={setOemFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="OEM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All OEMs</SelectItem>
                      {oems.map((oem) => (
                        <SelectItem key={oem} value={oem!}>
                          {oem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-420px)]">
                <div className="p-4 space-y-2">
                  {inventoryLoading ? (
                    <p className="text-center text-muted-foreground py-8">
                      Loading inventory...
                    </p>
                  ) : filteredInventory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No available items match your search
                    </p>
                  ) : (
                    filteredInventory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.product_name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.oem} {item.modality}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            {formatCurrency(item.price || 0)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddItem(item)}
                          disabled={items.some((i) => i.inventoryId === item.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right Column - Current Quote */}
          <Card className="h-[calc(100vh-220px)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Current Quote
                {items.length > 0 && (
                  <Badge variant="secondary">{items.length} items</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Customer Name *</Label>
                  <Input
                    placeholder="Dr. John Smith"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email *</Label>
                  <Input
                    type="email"
                    placeholder="john@hospital.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Company</Label>
                  <Input
                    placeholder="ABC Hospital"
                    value={customer.company}
                    onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone</Label>
                  <Input
                    placeholder="(555) 123-4567"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              {/* Quote Items */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Items</Label>
                {items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Add items from inventory</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[180px]">
                    <div className="space-y-2 pr-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Label className="text-xs">Qty:</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                                  }
                                  className="w-16 h-7 text-xs"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <Label className="text-xs">Price:</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  value={item.unitPrice}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                                  }
                                  className="w-24 h-7 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 mt-1"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <Separator />

              {/* Notes */}
              <div className="space-y-1">
                <Label className="text-xs">Notes</Label>
                <Textarea
                  placeholder="Additional notes for the customer..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Totals */}
              <div className="space-y-1 pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Discount</span>
                  <Input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-24 h-7 text-xs text-right"
                  />
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={items.length === 0}
                  onClick={() => setPreviewOpen(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Quote
                </Button>
                <Button
                  className="flex-1"
                  disabled={!customer.name || !customer.email || items.length === 0}
                  onClick={handleGenerateQuote}
                >
                  Generate Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <QuotePreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={quotePreviewData}
      />
    </>
  );
};

export default QuoteBuilder;
