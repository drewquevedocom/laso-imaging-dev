import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Mail, 
  Search,
  Eye,
  X,
  Variable,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useEmailTemplates, 
  useCreateEmailTemplate, 
  useUpdateEmailTemplate, 
  useDeleteEmailTemplate,
  EmailTemplate 
} from "@/hooks/useEmailTemplates";

const CATEGORIES = [
  { value: "follow_up", label: "Follow Up" },
  { value: "pricing", label: "Pricing" },
  { value: "shipping", label: "Shipping" },
  { value: "site_visit", label: "Site Visit" },
  { value: "asset_request", label: "Asset Request" },
  { value: "general", label: "General" },
];

const AVAILABLE_VARIABLES = [
  { name: "{{name}}", description: "Contact's full name" },
  { name: "{{first_name}}", description: "Contact's first name" },
  { name: "{{company}}", description: "Company name" },
  { name: "{{equipment_type}}", description: "Type of equipment" },
  { name: "{{manufacturer}}", description: "Equipment manufacturer" },
  { name: "{{model}}", description: "Equipment model" },
  { name: "{{date}}", description: "Current or scheduled date" },
  { name: "{{time}}", description: "Scheduled time" },
  { name: "{{location}}", description: "Location/address" },
  { name: "{{quote_number}}", description: "Quote reference number" },
  { name: "{{price}}", description: "Price or amount" },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    follow_up: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    pricing: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    shipping: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    site_visit: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    asset_request: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    general: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
  };
  return colors[category] || colors.general;
};

const EmailTemplates = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Partial<EmailTemplate> | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const { data: templates = [], isLoading } = useEmailTemplates();
  const createMutation = useCreateEmailTemplate();
  const updateMutation = useUpdateEmailTemplate();
  const deleteMutation = useDeleteEmailTemplate();

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    const matchesSearch = 
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.subject.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreate = () => {
    setEditingTemplate({
      name: "",
      category: "general",
      subject: "",
      body_html: "",
      body_text: "",
      variables: [],
      is_active: true,
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  };

  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleSave = () => {
    if (!editingTemplate) return;

    // Extract variables from subject and body
    const variableRegex = /\{\{(\w+)\}\}/g;
    const foundVariables = new Set<string>();
    let match;
    
    while ((match = variableRegex.exec(editingTemplate.subject || "")) !== null) {
      foundVariables.add(`{{${match[1]}}}`);
    }
    while ((match = variableRegex.exec(editingTemplate.body_html || "")) !== null) {
      foundVariables.add(`{{${match[1]}}}`);
    }

    const templateData = {
      name: editingTemplate.name || "",
      category: editingTemplate.category || "general",
      subject: editingTemplate.subject || "",
      body_html: editingTemplate.body_html || "",
      body_text: editingTemplate.body_text || null,
      variables: Array.from(foundVariables),
      is_active: editingTemplate.is_active ?? true,
    };

    if ("id" in editingTemplate && editingTemplate.id) {
      updateMutation.mutate({ id: editingTemplate.id, ...templateData }, {
        onSuccess: () => {
          setIsEditorOpen(false);
          setEditingTemplate(null);
        },
      });
    } else {
      createMutation.mutate(templateData, {
        onSuccess: () => {
          setIsEditorOpen(false);
          setEditingTemplate(null);
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  const insertVariable = (variable: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      body_html: (editingTemplate.body_html || "") + variable,
    });
  };

  return (
    <>
      <Helmet>
        <title>Email Templates | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Email Templates</h1>
            <p className="text-muted-foreground">
              Manage reusable email templates for sales communications
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No templates found</p>
                <Button variant="link" onClick={handleCreate}>
                  Create your first template
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">{template.name}</h3>
                        <Badge className={getCategoryColor(template.category)}>
                          {CATEGORIES.find(c => c.value === template.category)?.label || template.category}
                        </Badge>
                        {!template.is_active && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Subject: {template.subject}
                      </p>
                      {template.variables && template.variables.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Variable className="h-3 w-3" />
                          <span>{template.variables.length} variables</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreview(template)}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(template)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirmId(template.id)}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Template Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate && "id" in editingTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription>
              Create reusable email templates with variable placeholders
            </DialogDescription>
          </DialogHeader>

          {editingTemplate && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={editingTemplate.name || ""}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    placeholder="e.g., Follow-up - First Contact"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editingTemplate.category || "general"}
                    onValueChange={(value) => setEditingTemplate({ ...editingTemplate, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={editingTemplate.subject || ""}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  placeholder="e.g., Following up on your {{equipment_type}} inquiry"
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-2">
                  <Label htmlFor="body">Email Body (HTML)</Label>
                  <Textarea
                    id="body"
                    value={editingTemplate.body_html || ""}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, body_html: e.target.value })}
                    placeholder="Write your email content here. Use {{variable}} for dynamic content."
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available Variables</Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-[340px] overflow-y-auto">
                    {AVAILABLE_VARIABLES.map((variable) => (
                      <button
                        key={variable.name}
                        onClick={() => insertVariable(variable.name)}
                        className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                      >
                        <code className="text-xs font-mono bg-primary/10 text-primary px-1 py-0.5 rounded">
                          {variable.name}
                        </code>
                        <p className="text-xs text-muted-foreground mt-1">
                          {variable.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={editingTemplate.is_active ?? true}
                  onCheckedChange={(checked) => setEditingTemplate({ ...editingTemplate, is_active: checked })}
                />
                <Label htmlFor="active">Template is active</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Template Preview
            </DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">SUBJECT</Label>
                <p className="font-medium">{previewTemplate.subject}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">BODY</Label>
                <div 
                  className="mt-2 p-4 border rounded-lg bg-white dark:bg-gray-900 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewTemplate.body_html }}
                />
              </div>
              {previewTemplate.variables && previewTemplate.variables.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">VARIABLES USED</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {previewTemplate.variables.map((v) => (
                      <Badge key={v} variant="secondary" className="font-mono text-xs">
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the email template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmailTemplates;
