import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useInventory,
  useCreateInventory,
  useUpdateInventory,
  useDeleteInventory,
  useInventoryStats,
} from "@/hooks/useInventory";
import { InventoryItem } from "@/types/database";
import { formatEquipmentText } from "@/lib/utils";

const OEM_OPTIONS = ["GE", "Siemens", "Philips", "Toshiba/Canon", "Hitachi", "Other"];
const MODALITY_OPTIONS = ["MRI", "CT", "X-Ray", "PET/CT", "Ultrasound", "Other"];
const STATUS_OPTIONS = ["Available", "Sold", "Reserved", "In Transit", "Under Repair"];
const CONDITION_OPTIONS = ["Excellent", "Good", "Fair", "Refurbished"];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Available: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Sold: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    Reserved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "In Transit": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "Under Repair": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return styles[status] || styles.Available;
};

const AdminInventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oemFilter, setOemFilter] = useState<string>("all");
  const [modalityFilter, setModalityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const { data: inventory = [], isLoading } = useInventory();
  const { data: stats } = useInventoryStats();
  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();

  // Form state
  const [formData, setFormData] = useState({
    product_name: "",
    oem: "GE",
    modality: "MRI",
    serial_number: "",
    availability_status: "Available",
    price: "",
    description: "",
    location: "",
    condition: "Good",
    year_manufactured: "",
    software_version: "",
    magnet_type: "",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      product_name: "",
      oem: "GE",
      modality: "MRI",
      serial_number: "",
      availability_status: "Available",
      price: "",
      description: "",
      location: "",
      condition: "Good",
      year_manufactured: "",
      software_version: "",
      magnet_type: "",
      notes: "",
    });
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        product_name: item.product_name,
        oem: item.oem,
        modality: item.modality,
        serial_number: item.serial_number || "",
        availability_status: item.availability_status,
        price: item.price?.toString() || "",
        description: item.description || "",
        location: item.location || "",
        condition: item.condition || "Good",
        year_manufactured: item.year_manufactured?.toString() || "",
        software_version: item.software_version || "",
        magnet_type: item.magnet_type || "",
        notes: item.notes || "",
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    const data = {
      product_name: formData.product_name,
      oem: formData.oem,
      modality: formData.modality,
      serial_number: formData.serial_number || undefined,
      availability_status: formData.availability_status as InventoryItem["availability_status"],
      price: formData.price ? parseFloat(formData.price) : undefined,
      description: formData.description || undefined,
      location: formData.location || undefined,
      condition: formData.condition as InventoryItem["condition"],
      year_manufactured: formData.year_manufactured ? parseInt(formData.year_manufactured) : undefined,
      software_version: formData.software_version || undefined,
      magnet_type: formData.magnet_type || undefined,
      notes: formData.notes || undefined,
      images: [],
    };

    if (editingItem) {
      await updateInventory.mutateAsync({ id: editingItem.id, ...data });
    } else {
      await createInventory.mutateAsync(data);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      await deleteInventory.mutateAsync(id);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateInventory.mutateAsync({ 
      id, 
      availability_status: status as InventoryItem["availability_status"] 
    });
  };

  // Filter inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serial_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.oem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOem = oemFilter === "all" || item.oem === oemFilter;
    const matchesModality = modalityFilter === "all" || item.modality === modalityFilter;
    const matchesStatus = statusFilter === "all" || item.availability_status === statusFilter;
    return matchesSearch && matchesOem && matchesModality && matchesStatus;
  });

  const formatPrice = (price?: number) => {
    if (!price) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Helmet>
        <title>Inventory | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">
              Track and manage {formatEquipmentText("MRI")} equipment inventory
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Equipment" : "Add New Equipment"}</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update equipment details" : "Enter details for the new equipment"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Product Name *</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      placeholder="GE Signa HDxt 1.5T"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial_number">Serial Number</Label>
                    <Input
                      id="serial_number"
                      value={formData.serial_number}
                      onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                      placeholder="SN12345678"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>OEM *</Label>
                    <Select value={formData.oem} onValueChange={(v) => setFormData({ ...formData, oem: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {OEM_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Modality *</Label>
                    <Select value={formData.modality} onValueChange={(v) => setFormData({ ...formData, modality: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MODALITY_OPTIONS.map((m) => (
                          <SelectItem key={m} value={m}>{formatEquipmentText(m)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select value={formData.availability_status} onValueChange={(v) => setFormData({ ...formData, availability_status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="150000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CONDITION_OPTIONS.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year Manufactured</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year_manufactured}
                      onChange={(e) => setFormData({ ...formData, year_manufactured: e.target.value })}
                      placeholder="2020"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Chicago, IL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="magnet_type">Magnet Type</Label>
                    <Input
                      id="magnet_type"
                      value={formData.magnet_type}
                      onChange={(e) => setFormData({ ...formData, magnet_type: e.target.value })}
                      placeholder="1.5T, 3.0T"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="software_version">Software Version</Label>
                  <Input
                    id="software_version"
                    value={formData.software_version}
                    onChange={(e) => setFormData({ ...formData, software_version: e.target.value })}
                    placeholder="HD23.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Equipment description..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Internal notes..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.product_name}>
                  {editingItem ? "Update" : "Add"} Equipment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.available || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Reserved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.reserved || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4 text-gray-500" />
                Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats?.sold || 0}</div>
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
                  placeholder="Search by name, serial number, OEM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={oemFilter} onValueChange={setOemFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="OEM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All OEMs</SelectItem>
                  {OEM_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Modality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modalities</SelectItem>
                  {MODALITY_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m}>{formatEquipmentText(m)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>OEM</TableHead>
                  <TableHead>Modality</TableHead>
                  <TableHead>Serial #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {inventory.length === 0 ? "No equipment in inventory" : "No equipment matches filters"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.product_name}</div>
                        {item.condition && (
                          <div className="text-xs text-muted-foreground">{item.condition}</div>
                        )}
                      </TableCell>
                      <TableCell>{item.oem}</TableCell>
                      <TableCell>{formatEquipmentText(item.modality)}</TableCell>
                      <TableCell className="font-mono text-sm">{item.serial_number || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusBadge(item.availability_status)}>
                          {item.availability_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPrice(item.price)}</TableCell>
                      <TableCell>{item.location || "—"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(item)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(item.id, "Available")}>
                              Mark Available
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(item.id, "Reserved")}>
                              Mark Reserved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(item.id, "Sold")}>
                              Mark Sold
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(item.id)}
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
    </>
  );
};

export default AdminInventory;
