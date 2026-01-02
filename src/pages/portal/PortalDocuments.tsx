import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FileText, Download, File, FileSpreadsheet, FileImage } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface Document {
  id: string;
  document_type: string | null;
  title: string;
  file_url: string;
  created_at: string;
}

const PortalDocuments = () => {
  const { profile } = useCustomerAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchDocuments();
    }
  }, [profile]);

  const fetchDocuments = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from("customer_documents")
      .select("*")
      .eq("customer_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const getDocumentIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "quote":
      case "invoice":
        return <FileSpreadsheet className="h-5 w-5" />;
      case "manual":
      case "certificate":
        return <FileText className="h-5 w-5" />;
      case "image":
        return <FileImage className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "quote":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "invoice":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "contract":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "manual":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "certificate":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Group documents by type
  const groupedDocuments = documents.reduce((acc, doc) => {
    const type = doc.document_type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <p className="text-muted-foreground mt-1">
          Access your quotes, invoices, manuals, and certificates
        </p>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Documents</h3>
            <p className="text-muted-foreground">
              Your documents will appear here when they're available.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedDocuments).map(([type, docs]) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="text-lg capitalize flex items-center gap-2">
                  {getDocumentIcon(type)}
                  {type === "other" ? "Other Documents" : `${type}s`}
                  <Badge variant="secondary" className="ml-2">
                    {docs.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg">
                          {getDocumentIcon(doc.document_type)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Added {format(new Date(doc.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getTypeColor(doc.document_type)}>
                          {doc.document_type || "Document"}
                        </Badge>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalDocuments;
