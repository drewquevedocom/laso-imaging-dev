import { useState } from "react";
import { Plus } from "lucide-react";
import { useTriageLeads, useUpdateLeadStatus, KANBAN_COLUMNS, TriageLead } from "@/hooks/useLeadTriage";
import LeadCard from "./LeadCard";
import LeadDetailPanel from "./LeadDetailPanel";
import LeadTriageFilters, { LeadFilters } from "./LeadTriageFilters";
import UniversalIntakeForm from "./UniversalIntakeForm";
import MobileLeadTriageView from "./MobileLeadTriageView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const LeadTriageBoard = () => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<LeadFilters>({
    search: "",
    dateFrom: undefined,
    dateTo: undefined,
    scoreMin: 0,
    scoreMax: 100,
    types: [],
  });
  const [intakeFormOpen, setIntakeFormOpen] = useState(false);
  
  const { data: leads = [], isLoading } = useTriageLeads(filters);
  const updateStatus = useUpdateLeadStatus();
  const [selectedLead, setSelectedLead] = useState<TriageLead | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Group leads by status
  const getLeadsForColumn = (dbStatus: string) => {
    return leads.filter((lead) => lead.status === dbStatus);
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    if (draggedLeadId) {
      updateStatus.mutate({ leadId: draggedLeadId, status: targetStatus });
      setDraggedLeadId(null);
    }
  };

  const handleStatusChange = (leadId: string, status: string) => {
    updateStatus.mutate({ leadId, status });
  };

  const handleCardClick = (lead: TriageLead) => {
    setSelectedLead(lead);
  };

  // Mobile view
  if (isMobile) {
    return (
      <MobileLeadTriageView
        leads={leads}
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {KANBAN_COLUMNS.map((col) => (
          <div key={col.id} className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Header with Filters and New Inquiry Button */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <LeadTriageFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        <Button
          onClick={() => setIntakeFormOpen(true)}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-lg"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          New Inquiry
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-w-[1000px]">
          {KANBAN_COLUMNS.map((column) => {
            const columnLeads = getLeadsForColumn(column.dbStatus);
            const isQuotingCol = column.id === "quoting";
            const hasQuotingLeads = isQuotingCol && columnLeads.length > 0;

            return (
              <div
                key={column.id}
                className="flex-1 min-w-[220px] max-w-[280px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.dbStatus)}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between mb-3 px-2 py-1 rounded-md transition-colors ${
                  hasQuotingLeads ? "bg-amber-100 dark:bg-amber-950/30" : ""
                }`}>
                  <h3 className={`font-semibold text-sm flex items-center gap-1.5 ${
                    hasQuotingLeads ? "text-amber-800 dark:text-amber-400" : "text-foreground"
                  }`}>
                    {hasQuotingLeads && (
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                    )}
                    {column.label}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    hasQuotingLeads
                      ? "bg-amber-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {columnLeads.length}
                  </span>
                </div>

                {/* Column Content */}
                <div className={`rounded-lg p-2 min-h-[400px] space-y-2 ${
                  hasQuotingLeads ? "bg-amber-50/60 dark:bg-amber-950/10" : "bg-muted/30"
                }`}>
                  {columnLeads.length === 0 ? (
                    <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                      No leads
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onClick={() => handleCardClick(lead)}
                        className="cursor-pointer"
                      >
                        <LeadCard
                          lead={lead}
                          onStatusChange={handleStatusChange}
                          onViewDetails={handleCardClick}
                          variant="compact"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

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
    </>
  );
};

export default LeadTriageBoard;
