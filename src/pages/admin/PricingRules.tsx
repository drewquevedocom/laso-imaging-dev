import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Edit, Trash2, Calculator, Percent, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePricingRules,
  useCreatePricingRule,
  useUpdatePricingRule,
  useDeletePricingRule,
  PricingRule,
} from "@/hooks/usePricingRules";

const RULE_TYPES = [
  { value: "min_margin", label: "Minimum Margin", icon: Percent, description: "Minimum profit margin required" },
  { value: "auto_expiration", label: "Auto Expiration", icon: Clock, description: "Days until quote/offer expires" },
  { value: "discount_threshold", label: "Discount Threshold", icon: AlertTriangle, description: "Max discount before warning" },
  { value: "approval_threshold", label: "Approval Required", icon: Calculator, description: "Discount % requiring manager approval" },
];

const MODALITY_OPTIONS = ["All", "MRI", "CT", "X-Ray", "PET/CT", "Ultrasound"];

const getRuleTypeDisplay = (type: string) => {
  const ruleType = RULE_TYPES.find(r => r.value === type);
  return ruleType?.label || type;
};

const getRuleTypeIcon = (type: string) => {
  const ruleType = RULE_TYPES.find(r => r.value === type);
  return ruleType?.icon || Calculator;
};

const formatValue = (type: string, value: number) => {
  switch (type) {
    case "min_margin":
    case "discount_threshold":
    case "approval_threshold":
      return `${value}%`;
    case "auto_expiration":
      return `${value} days`;
    default:
      return value.toString();
  }
};

export default function PricingRules() {
  const { data: rules = [], isLoading } = usePricingRules();
  const createRule = useCreatePricingRule();
  const updateRule = useUpdatePricingRule();
  const deleteRule = useDeletePricingRule();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [formData, setFormData] = useState({
    rule_type: "min_margin" as PricingRule["rule_type"],
    modality: "",
    value: "",
    description: "",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      rule_type: "min_margin",
      modality: "",
      value: "",
      description: "",
      is_active: true,
    });
    setEditingRule(null);
  };

  const handleOpenDialog = (rule?: PricingRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        rule_type: rule.rule_type,
        modality: rule.modality || "",
        value: rule.value.toString(),
        description: rule.description || "",
        is_active: rule.is_active,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    const data = {
      rule_type: formData.rule_type,
      modality: formData.modality && formData.modality !== "All" ? formData.modality : undefined,
      value: parseFloat(formData.value),
      description: formData.description || undefined,
      is_active: formData.is_active,
    };

    if (editingRule) {
      await updateRule.mutateAsync({ id: editingRule.id, ...data });
    } else {
      await createRule.mutateAsync(data);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this pricing rule?")) {
      await deleteRule.mutateAsync(id);
    }
  };

  const handleToggleActive = async (rule: PricingRule) => {
    await updateRule.mutateAsync({ id: rule.id, is_active: !rule.is_active });
  };

  // Group rules by type for display
  const rulesByType = rules.reduce((acc, rule) => {
    if (!acc[rule.rule_type]) {
      acc[rule.rule_type] = [];
    }
    acc[rule.rule_type].push(rule);
    return acc;
  }, {} as Record<string, PricingRule[]>);

  return (
    <>
      <Helmet>
        <title>Pricing Rules | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pricing Rules</h1>
            <p className="text-muted-foreground">
              Configure margins, approval thresholds, and expiration settings
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {RULE_TYPES.map((type) => {
            const typeRules = rulesByType[type.value] || [];
            const activeCount = typeRules.filter(r => r.is_active).length;
            const Icon = type.icon;
            
            return (
              <Card key={type.value}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeCount}</div>
                  <p className="text-xs text-muted-foreground">{typeRules.length} total rules</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Rules</CardTitle>
            <CardDescription>
              Rules are applied in order of specificity. Modality-specific rules take precedence.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Modality</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading rules...
                    </TableCell>
                  </TableRow>
                ) : rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No pricing rules configured. Add your first rule to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  rules.map((rule) => {
                    const Icon = getRuleTypeIcon(rule.rule_type);
                    return (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{getRuleTypeDisplay(rule.rule_type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {rule.modality || "All"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          {formatValue(rule.rule_type, rule.value)}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">
                          {rule.description || "—"}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={() => handleToggleActive(rule)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(rule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(rule.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRule ? "Edit Pricing Rule" : "Add Pricing Rule"}</DialogTitle>
              <DialogDescription>
                Configure guardrails for quotes and offers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Rule Type</Label>
                <Select
                  value={formData.rule_type}
                  onValueChange={(v) => setFormData({ ...formData, rule_type: v as PricingRule["rule_type"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RULE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col">
                          <span>{type.label}</span>
                          <span className="text-xs text-muted-foreground">{type.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Modality</Label>
                  <Select
                    value={formData.modality || "All"}
                    onValueChange={(v) => setFormData({ ...formData, modality: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODALITY_OPTIONS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Value {formData.rule_type === "auto_expiration" ? "(days)" : "(%)"}
                  </Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.rule_type === "auto_expiration" ? "30" : "15"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain when this rule applies..."
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.value}>
                {editingRule ? "Update" : "Create"} Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
