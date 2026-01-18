import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter, X } from "lucide-react";
import { TriageLead, KANBAN_COLUMNS, useUpdateLeadStatus } from "@/hooks/useLeadTriage";
import LeadCard from "./LeadCard";
import LeadDetailPanel from "./LeadDetailPanel";
import LeadTriageFilters, { LeadFilters } from "./LeadTriageFilters";
import UniversalIntakeForm from "./UniversalIntakeForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileLeadTriageViewProps {
  leads: TriageLead[];
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  isLoading?: boolean;
}

const MobileLeadTriageView = ({ 
  leads, 
  filters, 
  onFiltersChange,
  isLoading = false 
}: MobileLeadTriageViewProps) => {
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [selectedLead, setSelectedLead] = useState<TriageLead | null>(null);
  const [intakeFormOpen, setIntakeFormOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const updateStatus = useUpdateLeadStatus();

  const activeColumn = KANBAN_COLUMNS[activeColumnIndex];
  const columnLeads = leads.filter(lead => lead.status === activeColumn.dbStatus);

  const handlePrevColumn = () => {
    setActiveColumnIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextColumn = () => {
    setActiveColumnIndex(prev => Math.min(KANBAN_COLUMNS.length - 1, prev + 1));
  };

  const handleStatusChange = (leadId: string, status: string) => {
    updateStatus.mutate({ leadId, status });
  };

  const handleSwipeLeft = (lead: TriageLead) => {
    // Move to next status
    const currentIndex = KANBAN_COLUMNS.findIndex(col => col.dbStatus === lead.status);
    if (currentIndex < KANBAN_COLUMNS.length - 1) {
      const nextStatus = KANBAN_COLUMNS[currentIndex + 1].dbStatus;
      updateStatus.mutate({ leadId: lead.id, status: nextStatus });
    }
  };

  const handleSwipeRight = (lead: TriageLead) => {
    // Move to previous status
    const currentIndex = KANBAN_COLUMNS.findIndex(col => col.dbStatus === lead.status);
    if (currentIndex > 0) {
      const prevStatus = KANBAN_COLUMNS[currentIndex - 1].dbStatus;
      updateStatus.mutate({ leadId: lead.id, status: prevStatus });
    }
  };

  const hasActiveFilters = filters.search || filters.dateFrom || filters.dateTo || 
    filters.scoreMin > 0 || filters.scoreMax < 100 || filters.types.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      {/* Mobile Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  !
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Leads</SheetTitle>
            </SheetHeader>
            <div className="mt-4 overflow-y-auto">
              <LeadTriageFilters 
                filters={filters} 
                onFiltersChange={(newFilters) => {
                  onFiltersChange(newFilters);
                  setFiltersOpen(false);
                }} 
              />
            </div>
          </SheetContent>
        </Sheet>

        <Button
          onClick={() => setIntakeFormOpen(true)}
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      {/* Column Navigation */}
      <div className="flex items-center justify-between mb-4 bg-muted/50 rounded-lg p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevColumn}
          disabled={activeColumnIndex === 0}
          className="h-10 w-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 text-center">
          <h2 className="font-semibold text-lg">{activeColumn.label}</h2>
          <p className="text-sm text-muted-foreground">
            {columnLeads.length} lead{columnLeads.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextColumn}
          disabled={activeColumnIndex === KANBAN_COLUMNS.length - 1}
          className="h-10 w-10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Column Dots Indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {KANBAN_COLUMNS.map((col, index) => {
          const count = leads.filter(l => l.status === col.dbStatus).length;
          return (
            <button
              key={col.id}
              onClick={() => setActiveColumnIndex(index)}
              className={cn(
                "relative h-3 rounded-full transition-all",
                index === activeColumnIndex 
                  ? "w-8 bg-primary" 
                  : "w-3 bg-muted-foreground/30"
              )}
            >
              {count > 0 && index !== activeColumnIndex && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : columnLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">No leads in this stage</p>
            <Button
              variant="link"
              size="sm"
              onClick={() => setIntakeFormOpen(true)}
              className="mt-2"
            >
              Add a new lead
            </Button>
          </div>
        ) : (
          columnLeads.map((lead) => (
            <div
              key={lead.id}
              className="touch-manipulation"
              onClick={() => setSelectedLead(lead)}
            >
              <LeadCard
                lead={lead}
                onStatusChange={handleStatusChange}
                onViewDetails={(l) => setSelectedLead(l as TriageLead)}
                variant="mobile"
              />
            </div>
          ))
        )}
      </div>

      {/* Swipe Hint */}
      <div className="text-center text-xs text-muted-foreground py-2 bg-muted/30 rounded-lg">
        Tap a card to view details • Swipe columns to navigate
      </div>

      {/* Lead Detail Panel */}
      <LeadDetailPanel
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Universal Intake Form */}
      <UniversalIntakeForm
        open={intakeFormOpen}
        onOpenChange={setIntakeFormOpen}
      />
    </div>
  );
};

export default MobileLeadTriageView;
