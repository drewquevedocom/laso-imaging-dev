import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  Wrench,
  Plus,
  ShoppingCart,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventory } from "@/hooks/useInventory";
import { quotableServices, serviceCategories, formatServicePrice, QuotableService } from "@/data/servicesCatalog";
import { toast } from "sonner";

const SalesSearch = () => {
  const navigate = useNavigate();
  const { data: inventory = [], isLoading } = useInventory();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [modalityFilter, setModalityFilter] = useState("all");
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("all");

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.oem?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.modality?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModality = modalityFilter === "all" || item.modality === modalityFilter;
      return matchesSearch && matchesModality;
    });
  }, [inventory, searchQuery, modalityFilter]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return quotableServices.filter((service) => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = serviceCategoryFilter === "all" || service.category === serviceCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, serviceCategoryFilter]);

  // Get unique modalities
  const modalities = useMemo(() => {
    const mods = new Set(inventory.map((item) => item.modality).filter(Boolean));
    return Array.from(mods);
  }, [inventory]);

  const handleAddToQuote = (item: typeof inventory[0] | QuotableService, type: 'product' | 'service') => {
    // Store in session storage for Quote Builder to pick up
    const quoteItems = JSON.parse(sessionStorage.getItem('pendingQuoteItems') || '[]');
    
    if (type === 'product') {
      const product = item as typeof inventory[0];
      quoteItems.push({
        type: 'product',
        id: product.id,
        name: product.product_name,
        description: `${product.oem} ${product.modality || ''}`.trim(),
        unitPrice: product.price || 0,
        quantity: 1,
      });
    } else {
      const service = item as QuotableService;
      quoteItems.push({
        type: 'service',
        id: service.id,
        name: service.name,
        description: service.description,
        unitPrice: service.basePrice,
        quantity: 1,
      });
    }
    
    sessionStorage.setItem('pendingQuoteItems', JSON.stringify(quoteItems));
    toast.success(`Added to quote`, {
      action: {
        label: "Go to Quote Builder",
        onClick: () => navigate('/admin/quote-builder'),
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const cat = serviceCategories.find(c => c.id === category);
    return cat?.color || 'bg-muted text-muted-foreground';
  };

  return (
    <>
      <Helmet>
        <title>Product Search | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Product & Service Search</h1>
            <p className="text-muted-foreground">
              Find equipment and services to add to quotes
            </p>
          </div>
          <Button onClick={() => navigate('/admin/quote-builder')}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Open Quote Builder
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search MRI systems, CT scanners, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Products vs Services */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                Equipment ({filteredInventory.length})
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Wrench className="h-4 w-4" />
                Services ({filteredServices.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Filters */}
            <div className="flex gap-2">
              {activeTab === "products" && (
                <Select value={modalityFilter} onValueChange={setModalityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
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
              )}
              {activeTab === "services" && (
                <Select value={serviceCategoryFilter} onValueChange={setServiceCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {serviceCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Available Equipment</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {isLoading ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Loading inventory...
                    </div>
                  ) : filteredInventory.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No equipment found matching your search
                    </div>
                  ) : (
                    <div className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredInventory.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                              {item.images?.[0] ? (
                                <img
                                  src={item.images[0]}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <Package className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.product_name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.oem} • {item.modality}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant={item.availability_status === 'Available' ? 'default' : 'secondary'}
                                  className="text-[10px]"
                                >
                                  {item.availability_status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t">
                            <span className="font-semibold text-primary">
                              {formatCurrency(item.price || 0)}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleAddToQuote(item, 'product')}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add to Quote
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Available Services</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {filteredServices.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No services found matching your search
                    </div>
                  ) : (
                    <div className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                              <Wrench className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {service.description}
                              </p>
                              <Badge className={`mt-1 text-[10px] ${getCategoryColor(service.category)}`}>
                                {serviceCategories.find(c => c.id === service.category)?.label}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t">
                            <span className="font-semibold text-primary text-sm">
                              {formatServicePrice(service)}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleAddToQuote(service, 'service')}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add to Quote
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SalesSearch;
