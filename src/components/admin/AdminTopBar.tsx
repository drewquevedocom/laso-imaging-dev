import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, User, Settings, FileText, Users, Package, UserPlus, FilePlus, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ThemeToggle from "./ThemeToggle";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGlobalSearch, SearchResult } from "@/hooks/useGlobalSearch";
import { useCreateCustomer } from "@/hooks/useCustomers";
import { toast } from "sonner";

const AdminTopBar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Quick action dialogs
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", company: "", phone: "", notes: "" });
  
  const createCustomer = useCreateCustomer();

  const { data: searchResults = [], isLoading: isSearching } = useGlobalSearch(searchQuery);

  // Fetch hot leads count for notification badge
  const { data: hotLeadsCount = 0 } = useQuery({
    queryKey: ["hot-leads-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("is_hot", true)
        .eq("status", "new");
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'lead':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'quote':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'customer':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const handleCreateCustomer = async () => {
    if (!customerForm.name || !customerForm.email) {
      toast.error("Name and email are required");
      return;
    }
    try {
      await createCustomer.mutateAsync(customerForm);
      toast.success("Customer created");
      setNewCustomerOpen(false);
      setCustomerForm({ name: "", email: "", company: "", phone: "", notes: "" });
    } catch (error) {
      toast.error("Failed to create customer");
    }
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Global Search */}
        <div className="flex-1 max-w-xl" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads, quotes, customers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
            
            {/* Search Results Dropdown */}
            {isSearchOpen && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50">
                <ScrollArea className="max-h-[300px]">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Searching...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No results found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="p-1">
                      {/* Group results by type */}
                      {['lead', 'quote', 'customer'].map(type => {
                        const typeResults = searchResults.filter(r => r.type === type);
                        if (typeResults.length === 0) return null;
                        
                        return (
                          <div key={type} className="mb-2">
                            <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                              {type === 'lead' ? 'Leads' : type === 'quote' ? 'Quotes' : 'Customers'}
                            </p>
                            {typeResults.map(result => (
                              <button
                                key={`${result.type}-${result.id}`}
                                className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md text-left"
                                onClick={() => handleResultClick(result)}
                              >
                                {getResultIcon(result.type)}
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm truncate">{result.title}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {result.subtitle}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setNewCustomerOpen(true)}>
                  <UserPlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Customer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/quote-builder")}>
                  <FilePlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Quote</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/admin/notifications")}
          >
            <Bell className="h-5 w-5" />
            {hotLeadsCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-2 border-white shadow-lg font-bold"
              >
                {hotLeadsCount > 9 ? "9+" : hotLeadsCount}
              </Badge>
            )}
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">Administrator</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* New Customer Dialog */}
      <Dialog open={newCustomerOpen} onOpenChange={setNewCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Quick add a new customer to your database
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quick-name">Name *</Label>
                <Input
                  id="quick-name"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-email">Email *</Label>
                <Input
                  id="quick-email"
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  placeholder="john@hospital.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quick-company">Company</Label>
                <Input
                  id="quick-company"
                  value={customerForm.company}
                  onChange={(e) => setCustomerForm({ ...customerForm, company: e.target.value })}
                  placeholder="ABC Hospital"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-phone">Phone</Label>
                <Input
                  id="quick-phone"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCustomerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCustomer} disabled={createCustomer.isPending}>
              {createCustomer.isPending ? "Adding..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default AdminTopBar;
