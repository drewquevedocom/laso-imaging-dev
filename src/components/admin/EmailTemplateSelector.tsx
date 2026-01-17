import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createSanitizedHTML } from "@/lib/sanitize";
import { Mail, Send, FileText, Truck, Calendar, Camera, MessageSquare } from "lucide-react";

interface EmailTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
  variables?: Record<string, string>;
}

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body_html: string;
  variables: string[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  follow_up: <MessageSquare className="h-4 w-4" />,
  pricing: <FileText className="h-4 w-4" />,
  shipping: <Truck className="h-4 w-4" />,
  site_visit: <Calendar className="h-4 w-4" />,
  asset_request: <Camera className="h-4 w-4" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  follow_up: "Follow-Up",
  pricing: "Pricing",
  shipping: "Shipping",
  site_visit: "Site Visit",
  asset_request: "Asset Request",
};

export function EmailTemplateSelector({
  isOpen,
  onClose,
  recipientEmail,
  recipientName,
  variables = {},
}: EmailTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});

  const { data: templates } = useQuery({
    queryKey: ["email-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true });

      if (error) throw error;
      return data as EmailTemplate[];
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTemplate) throw new Error("No template selected");

      const { error } = await supabase.functions.invoke("send-lead-email", {
        body: {
          to: recipientEmail,
          subject: replaceVariables(editedSubject),
          html: replaceVariables(editedBody),
        },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Email sent successfully");
      onClose();
      resetState();
    },
    onError: (error) => {
      toast.error("Failed to send email: " + error.message);
    },
  });

  const replaceVariables = (text: string): string => {
    const allVariables = { ...variables, ...customVariables, name: recipientName };
    let result = text;
    Object.entries(allVariables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value || "");
    });
    return result;
  };

  const selectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditedSubject(template.subject);
    setEditedBody(template.body_html);

    // Initialize custom variables from template
    const templateVars: Record<string, string> = {};
    (template.variables || []).forEach((v: string) => {
      templateVars[v] = variables[v] || "";
    });
    setCustomVariables(templateVars);
  };

  const resetState = () => {
    setSelectedTemplate(null);
    setEditedSubject("");
    setEditedBody("");
    setCustomVariables({});
  };

  const groupedTemplates = templates?.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, EmailTemplate[]>);

  const categories = Object.keys(groupedTemplates || {});

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email to {recipientName}
          </DialogTitle>
          <DialogDescription>
            Select a template or customize your message
          </DialogDescription>
        </DialogHeader>

        {!selectedTemplate ? (
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="w-full flex-wrap h-auto gap-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center gap-2"
                >
                  {CATEGORY_ICONS[category]}
                  {CATEGORY_LABELS[category] || category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <ScrollArea className="h-[400px]">
                  <div className="grid gap-3 p-1">
                    {groupedTemplates?.[category]?.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 border rounded-lg cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
                        onClick={() => selectTemplate(template)}
                      >
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Subject: {template.subject}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{selectedTemplate.name}</h4>
              <Button variant="ghost" size="sm" onClick={resetState}>
                ← Back to templates
              </Button>
            </div>

            <div>
              <Label>To</Label>
              <Input value={recipientEmail} disabled className="mt-1" />
            </div>

            <div>
              <Label>Subject</Label>
              <Input
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="mt-1"
              />
            </div>

            {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {selectedTemplate.variables
                  .filter((v: string) => v !== "name")
                  .map((variable: string) => (
                    <div key={variable}>
                      <Label className="capitalize">
                        {variable.replace(/_/g, " ")}
                      </Label>
                      <Input
                        value={customVariables[variable] || variables[variable] || ""}
                        onChange={(e) =>
                          setCustomVariables((prev) => ({
                            ...prev,
                            [variable]: e.target.value,
                          }))
                        }
                        placeholder={`Enter ${variable}`}
                        className="mt-1"
                      />
                    </div>
                  ))}
              </div>
            )}

            <div>
              <Label>Preview</Label>
              <ScrollArea className="h-[200px] mt-1 border rounded-lg p-4">
                <div
                  dangerouslySetInnerHTML={createSanitizedHTML(replaceVariables(editedBody))}
                />
              </ScrollArea>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => sendMutation.mutate()}
                disabled={sendMutation.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                {sendMutation.isPending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
