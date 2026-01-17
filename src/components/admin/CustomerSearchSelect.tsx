import { useState } from "react";
import { Search, Plus, User, Building2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchCustomers, useCreateCustomer, Customer } from "@/hooks/useCustomers";

interface CustomerInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

interface CustomerSearchSelectProps {
  value: CustomerInfo;
  onChange: (customer: CustomerInfo) => void;
}

const CustomerSearchSelect = ({ value, onChange }: CustomerSearchSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState<CustomerInfo>({
    name: "",
    email: "",
    company: "",
    phone: "",
  });
  
  const { data: searchResults = [], isLoading } = useSearchCustomers(searchTerm);
  const createCustomer = useCreateCustomer();

  const handleSelectCustomer = (customer: Customer) => {
    onChange({
      name: customer.name,
      email: customer.email,
      company: customer.company || "",
      phone: customer.phone || "",
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) return;
    
    const created = await createCustomer.mutateAsync({
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone || null,
      company: newCustomer.company || null,
      notes: null,
    });
    
    if (created) {
      onChange({
        name: created.name,
        email: created.email,
        company: created.company || "",
        phone: created.phone || "",
      });
      setShowAddDialog(false);
      setNewCustomer({ name: "", email: "", company: "", phone: "" });
    }
  };

  const hasSelection = value.name && value.email;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Customer</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 text-xs"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-3 w-3 mr-1" />
          New Customer
        </Button>
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-start text-left font-normal h-auto py-2"
          >
            {hasSelection ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{value.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {value.company || value.email}
                  </p>
                </div>
                <Check className="ml-auto h-4 w-4 text-primary flex-shrink-0" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>Search or add customer...</span>
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
                autoFocus
              />
            </div>
          </div>
          <ScrollArea className="h-[200px]">
            {isLoading ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                Searching...
              </p>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  {searchTerm.length < 2 
                    ? "Type to search customers" 
                    : "No customers found"}
                </p>
                {searchTerm.length >= 2 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-1"
                    onClick={() => {
                      setNewCustomer({ ...newCustomer, name: searchTerm });
                      setShowAddDialog(true);
                      setIsOpen(false);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add "{searchTerm}" as new customer
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-1">
                {searchResults.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    className="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-md text-left"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {customer.company ? (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{customer.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {customer.company || customer.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Quick edit fields when customer is selected */}
      {hasSelection && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              type="email"
              value={value.email}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input
              value={value.phone}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
        </div>
      )}

      {/* Add New Customer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Dr. John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="john@hospital.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={newCustomer.company}
                  onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                  placeholder="ABC Hospital"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
              disabled={!newCustomer.name || !newCustomer.email || createCustomer.isPending}
            >
              {createCustomer.isPending ? "Adding..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerSearchSelect;
