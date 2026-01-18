import { useState } from "react";
import { Helmet } from "react-helmet-async";
import jsPDF from "jspdf";
import { 
  Download, 
  CheckSquare, 
  FileText, 
  Users, 
  Package, 
  DollarSign,
  Mail,
  Calendar,
  BarChart3,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface FeatureSection {
  title: string;
  icon: React.ReactNode;
  description: string;
  checklist: ChecklistItem[];
}

const TestingGuide = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const [features, setFeatures] = useState<FeatureSection[]>([
    {
      title: "Dashboard Overview",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Central hub for KPIs, lead analytics, and quick actions.",
      checklist: [
        { id: "d1", text: "Verify KPI cards show accurate counts (Total Leads, Hot Leads, Equipment, Pipeline)", checked: false },
        { id: "d2", text: "Confirm Lead Triage board displays and allows drag-and-drop", checked: false },
        { id: "d3", text: "Check Leads Over Time chart renders properly", checked: false },
        { id: "d4", text: "Verify Hot List widget shows current hot leads", checked: false },
      ]
    },
    {
      title: "Lead Triage",
      icon: <Users className="h-5 w-5" />,
      description: "Kanban-style board for managing leads through the sales pipeline.",
      checklist: [
        { id: "l1", text: "Drag a lead card between columns (New → Contacted → Quoting)", checked: false },
        { id: "l2", text: "Click the 3-dot menu on a lead card and test each action", checked: false },
        { id: "l3", text: "Use the '+New Inquiry' button to add a manual lead", checked: false },
        { id: "l4", text: "Test search and filter functionality", checked: false },
        { id: "l5", text: "Click a lead card to open the detail panel", checked: false },
      ]
    },
    {
      title: "Equipment Hub",
      icon: <Package className="h-5 w-5" />,
      description: "Unified view for acquisitions, inventory, rentals, and analytics.",
      checklist: [
        { id: "e1", text: "Navigate between Acquisitions, Inventory, Rentals, and Analytics tabs", checked: false },
        { id: "e2", text: "In Acquisitions: Verify sell requests appear with priority badges", checked: false },
        { id: "e3", text: "In Inventory: Test Quick Quote and Make Offer buttons", checked: false },
        { id: "e4", text: "In Rentals: Check rental calendar displays bookings", checked: false },
        { id: "e5", text: "In Analytics: Verify charts render with equipment data", checked: false },
      ]
    },
    {
      title: "Quotes Management",
      icon: <FileText className="h-5 w-5" />,
      description: "Create, manage, and track customer quotes.",
      checklist: [
        { id: "q1", text: "Create a new quote using the Quote Builder", checked: false },
        { id: "q2", text: "Add line items with descriptions and pricing", checked: false },
        { id: "q3", text: "Send a quote via email", checked: false },
        { id: "q4", text: "Verify quote status updates (Draft → Sent → Viewed)", checked: false },
        { id: "q5", text: "Test the customer quote acceptance portal", checked: false },
      ]
    },
    {
      title: "Pricing Rules",
      icon: <DollarSign className="h-5 w-5" />,
      description: "Configure margin thresholds and approval workflows.",
      checklist: [
        { id: "p1", text: "Navigate to Pricing Rules page", checked: false },
        { id: "p2", text: "Create a new minimum margin rule", checked: false },
        { id: "p3", text: "Test enabling/disabling rules", checked: false },
        { id: "p4", text: "Verify rules apply to offers in Equipment Hub", checked: false },
      ]
    },
    {
      title: "Email Templates",
      icon: <Mail className="h-5 w-5" />,
      description: "Manage reusable email templates for lead communication.",
      checklist: [
        { id: "m1", text: "View existing email templates", checked: false },
        { id: "m2", text: "Create a new template with variables", checked: false },
        { id: "m3", text: "Test sending an email using a template", checked: false },
        { id: "m4", text: "Verify email tracking shows opens/clicks", checked: false },
      ]
    },
  ]);

  const toggleCheckbox = (sectionIndex: number, itemId: string) => {
    setFeatures(prev => prev.map((section, i) => {
      if (i !== sectionIndex) return section;
      return {
        ...section,
        checklist: section.checklist.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      };
    }));
  };

  const getTotalProgress = () => {
    const total = features.reduce((acc, section) => acc + section.checklist.length, 0);
    const checked = features.reduce((acc, section) => 
      acc + section.checklist.filter(item => item.checked).length, 0);
    return { total, checked, percentage: Math.round((checked / total) * 100) };
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      let yPos = 20;
      const lineHeight = 7;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Title
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("LASO Admin Platform", margin, yPos);
      yPos += 10;
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.text("Testing & Feature Guide", margin, yPos);
      yPos += 15;
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
      yPos += 15;
      
      // Executive Summary
      doc.setTextColor(0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Executive Summary", margin, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const summary = "This guide covers all features of the LASO Admin Platform, including lead management, equipment inventory, quotes, rentals, and analytics. Use the checklist to verify each feature works correctly.";
      const summaryLines = doc.splitTextToSize(summary, contentWidth);
      doc.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * 5 + 10;
      
      // Features
      features.forEach((section, sectionIndex) => {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        // Section Title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${sectionIndex + 1}. ${section.title}`, margin, yPos);
        yPos += 6;
        
        // Description
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(80);
        doc.text(section.description, margin, yPos);
        yPos += 8;
        
        // Checklist
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0);
        section.checklist.forEach((item) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          
          const checkbox = item.checked ? "[✓]" : "[ ]";
          doc.text(`${checkbox} ${item.text}`, margin + 5, yPos);
          yPos += lineHeight;
        });
        
        yPos += 5;
      });
      
      // Progress Summary
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      const progress = getTotalProgress();
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Testing Progress", margin, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Completed: ${progress.checked} of ${progress.total} items (${progress.percentage}%)`, margin, yPos);
      yPos += 15;
      
      // Footer with URLs
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Access URLs", margin, yPos);
      yPos += 7;
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Admin Dashboard: https://laso-ver1.lovable.app/admin/dashboard", margin, yPos);
      yPos += 5;
      doc.text("Customer Portal: https://laso-ver1.lovable.app/portal", margin, yPos);
      
      doc.save("laso-testing-guide.pdf");
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const progress = getTotalProgress();

  return (
    <>
      <Helmet>
        <title>Testing Guide | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Testing Guide</h1>
            <p className="text-muted-foreground">
              Comprehensive checklist for verifying platform features
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm py-1.5 px-3">
              {progress.checked}/{progress.total} Complete ({progress.percentage}%)
            </Badge>
            <Button onClick={exportToPDF} disabled={isExporting} className="gap-2">
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export PDF
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {/* Feature Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((section, sectionIndex) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.checklist.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => toggleCheckbox(sectionIndex, item.id)}
                    >
                      <Checkbox 
                        checked={item.checked}
                        className="mt-0.5"
                      />
                      <span className={`text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Key Workflows to Test
            </CardTitle>
            <CardDescription>
              End-to-end user journeys that should be verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Lead → Quote → Sale</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Submit a quote request form</li>
                  <li>Lead appears in triage board</li>
                  <li>Create quote from lead</li>
                  <li>Send quote to customer</li>
                  <li>Customer accepts quote</li>
                </ol>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Equipment Rental Flow</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Customer requests rental</li>
                  <li>Admin reviews in Equipment Hub</li>
                  <li>Booking created on calendar</li>
                  <li>Reminders sent automatically</li>
                  <li>Rental marked complete</li>
                </ol>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Sell Request Processing</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Seller submits equipment</li>
                  <li>Request appears in Acquisitions</li>
                  <li>Schedule site visit</li>
                  <li>Add to inventory</li>
                  <li>List for sale</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Access Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Admin Dashboard</h4>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  /admin/dashboard
                </code>
                <p className="text-sm text-muted-foreground mt-1">
                  Requires admin login credentials
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Customer-Facing Forms</h4>
                <div className="space-y-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded block w-fit">/quote</code>
                  <code className="text-sm bg-muted px-2 py-1 rounded block w-fit">/buy-sell</code>
                  <code className="text-sm bg-muted px-2 py-1 rounded block w-fit">/rentals</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TestingGuide;
