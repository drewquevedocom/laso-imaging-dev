import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  Clock, ChevronLeft, ChevronRight, Download, Unlock, Eye, ChevronDown, FileText,
} from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, parseISO } from "date-fns";

interface TimecardWeek {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  total_hours: number;
  submitted: boolean;
  submitted_at: string | null;
  locked: boolean;
}

interface TimecardEntry {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out: string | null;
  notes: string | null;
  break_minutes: number;
  entry_type: string;
  week_submitted: boolean;
}

interface AuditLog {
  id: string;
  action: string;
  old_value: string | null;
  new_value: string | null;
  edit_reason: string | null;
  performed_at: string;
  user_id: string;
}

const AdminTimecards = () => {
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weeks, setWeeks] = useState<TimecardWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [detailEntries, setDetailEntries] = useState<TimecardEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});

  const weekStart = format(selectedWeek, "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(selectedWeek, { weekStartsOn: 1 }), "yyyy-MM-dd");

  const fetchWeeks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("timecard_weeks")
      .select("*")
      .eq("week_start", weekStart)
      .order("total_hours", { ascending: false });

    if (data) setWeeks(data as unknown as TimecardWeek[]);
    if (error) console.error("Failed to fetch weeks:", error);

    // Also check for entries without a timecard_week record (in-progress)
    const { data: entries } = await supabase
      .from("timecard_entries")
      .select("user_id")
      .gte("clock_in", `${weekStart}T00:00:00`)
      .lte("clock_in", `${weekEnd}T23:59:59`)
      .eq("week_submitted", false);

    if (entries) {
      const existingUserIds = new Set((data || []).map((w: any) => w.user_id));
      const inProgressUserIds = [...new Set(entries.map((e: any) => e.user_id))]
        .filter((uid) => !existingUserIds.has(uid));

      if (inProgressUserIds.length > 0) {
        // Calculate hours for in-progress users
        for (const uid of inProgressUserIds) {
          const { data: userEntries } = await supabase
            .from("timecard_entries")
            .select("*")
            .eq("user_id", uid as string)
            .gte("clock_in", `${weekStart}T00:00:00`)
            .lte("clock_in", `${weekEnd}T23:59:59`);

          if (userEntries && userEntries.length > 0) {
            let totalHours = 0;
            for (const e of userEntries) {
              if (e.clock_out) {
                const raw = (new Date(e.clock_out).getTime() - new Date(e.clock_in).getTime()) / 3600000;
                totalHours += Math.max(0, raw - ((e as any).break_minutes || 0) / 60);
              }
            }
            setWeeks((prev) => [
              ...prev,
              {
                id: `temp-${uid}`,
                user_id: uid as string,
                week_start: weekStart,
                week_end: weekEnd,
                total_hours: Math.round(totalHours * 100) / 100,
                submitted: false,
                submitted_at: null,
                locked: false,
              },
            ]);
          }
        }
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchWeeks();
  }, [selectedWeek]);

  const openDetail = async (userId: string) => {
    setDetailUserId(userId);
    setShowDetail(true);

    const { data: entries } = await supabase
      .from("timecard_entries")
      .select("*")
      .eq("user_id", userId)
      .gte("clock_in", `${weekStart}T00:00:00`)
      .lte("clock_in", `${weekEnd}T23:59:59`)
      .order("clock_in", { ascending: true });

    if (entries) setDetailEntries(entries as unknown as TimecardEntry[]);

    const { data: logs } = await supabase
      .from("timecard_audit_log")
      .select("*")
      .eq("user_id", userId)
      .gte("performed_at", `${weekStart}T00:00:00`)
      .lte("performed_at", `${weekEnd}T23:59:59`)
      .order("performed_at", { ascending: false });

    if (logs) setAuditLogs(logs as unknown as AuditLog[]);
  };

  const handleUnlock = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke("timecard-clock", {
        body: {
          action: "admin_unlock",
          target_user_id: userId,
          week_start: weekStart,
          week_end: weekEnd,
        },
      });
      if (error) throw error;
      toast.success("Timecard unlocked!");
      fetchWeeks();
    } catch (e: any) {
      toast.error("Failed to unlock: " + e.message);
    }
  };

  const exportCSV = () => {
    const headers = ["User ID", "Total Hours", "Status"];
    const rows = weeks.map((w) => [
      w.user_id,
      w.total_hours,
      w.submitted ? "Submitted" : "In Progress",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timecards-${weekStart}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const calcHours = (entry: TimecardEntry) => {
    if (!entry.clock_out) return 0;
    const raw = (new Date(entry.clock_out).getTime() - new Date(entry.clock_in).getTime()) / 3600000;
    return Math.max(0, raw - (entry.break_minutes || 0) / 60);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Timecards</h1>
          <p className="text-muted-foreground text-sm">Review and manage all staff timecards</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-2" />Export CSV
        </Button>
      </div>

      {/* Week Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedWeek(subWeeks(selectedWeek, 1))}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <p className="font-semibold">
                {format(selectedWeek, "MMM d")} – {format(endOfWeek(selectedWeek, { weekStartsOn: 1 }), "MMM d, yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">{weeks.length} staff member{weeks.length !== 1 ? "s" : ""}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedWeek(addWeeks(selectedWeek, 1))}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Timecards Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />All Staff Timecards
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : weeks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No timecards found for this week.</p>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead className="text-right">Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeks.map((week) => (
                    <TableRow key={week.id} className={week.total_hours > 40 ? "bg-amber-50 dark:bg-amber-500/5" : ""}>
                      <TableCell className="font-medium">
                        <span className="text-xs text-muted-foreground">{week.user_id.slice(0, 8)}...</span>
                      </TableCell>
                      <TableCell className={`text-right font-bold ${week.total_hours > 40 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                        {week.total_hours}h
                        {week.total_hours > 40 && <span className="text-xs ml-1">⚠️</span>}
                      </TableCell>
                      <TableCell>
                        {week.submitted ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Submitted</Badge>
                        ) : (
                          <Badge variant="secondary">In Progress</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => openDetail(week.user_id)}>
                            <Eye className="h-4 w-4 mr-1" />View
                          </Button>
                          {week.submitted && week.locked && (
                            <Button size="sm" variant="outline" onClick={() => handleUnlock(week.user_id)}
                              className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-500/30 dark:hover:bg-amber-500/10">
                              <Unlock className="h-4 w-4 mr-1" />Unlock
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Timecard Detail — {detailUserId?.slice(0, 8)}...
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Entries Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Break</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailEntries.map((entry) => {
                    const hours = calcHours(entry);
                    const isTagDay = entry.entry_type !== "clock";
                    return (
                      <TableRow key={entry.id} className={hours > 8 ? "bg-amber-50 dark:bg-amber-500/5" : ""}>
                        <TableCell className="font-medium">{format(parseISO(entry.clock_in), "EEE, MMM d")}</TableCell>
                        <TableCell>
                          {isTagDay ? (
                            <Badge variant="secondary">{entry.entry_type.toUpperCase()}</Badge>
                          ) : format(parseISO(entry.clock_in), "h:mm a")}
                        </TableCell>
                        <TableCell>
                          {isTagDay ? "—" : (entry.clock_out ? format(parseISO(entry.clock_out), "h:mm a") : "—")}
                        </TableCell>
                        <TableCell>{(entry.break_minutes || 0) > 0 ? `${entry.break_minutes}min` : "—"}</TableCell>
                        <TableCell className={`text-right font-medium ${hours > 8 ? "text-amber-600" : ""}`}>
                          {hours > 0 ? hours.toFixed(2) : "—"}h
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                          {entry.notes || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Audit Trail */}
            {auditLogs.length > 0 && (
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground w-full py-2">
                  <ChevronDown className="h-4 w-4" />
                  Audit Trail ({auditLogs.length} entries)
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 mt-2">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-2 rounded bg-muted/50 text-sm">
                        <div className="flex-1">
                          <span className="font-medium">{log.action}</span>
                          {log.new_value && <span className="text-muted-foreground ml-2">→ {log.new_value}</span>}
                          {log.edit_reason && (
                            <p className="text-xs text-amber-600 mt-1">Reason: {log.edit_reason}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(parseISO(log.performed_at), "MMM d, h:mm a")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTimecards;
