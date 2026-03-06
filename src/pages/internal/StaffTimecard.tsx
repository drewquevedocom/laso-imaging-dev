import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  Clock, LogIn, LogOut, Send, AlertTriangle, Timer, Coffee, CoffeeIcon,
  Palmtree, Heart, CalendarDays, ChevronDown, Download, FileText, AlertCircle,
} from "lucide-react";
import {
  format, startOfWeek, endOfWeek, differenceInSeconds, parseISO, isBefore,
  startOfDay, isToday, subWeeks,
} from "date-fns";

interface TimecardEntry {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out: string | null;
  notes: string | null;
  week_submitted: boolean;
  created_at: string;
  break_minutes: number;
  entry_type: string;
  locked_by_admin: boolean;
  unlocked_at: string | null;
}

interface TimecardBreak {
  id: string;
  entry_id: string;
  user_id: string;
  break_start: string;
  break_end: string | null;
}

interface TimecardWeek {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  total_hours: number;
  submitted: boolean;
  submitted_at: string | null;
}

const StaffTimecard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<TimecardEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimecardEntry | null>(null);
  const [activeBreak, setActiveBreak] = useState<TimecardBreak | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [breakElapsed, setBreakElapsed] = useState(0);
  const [clockInNote, setClockInNote] = useState("");
  const [showClockInPrompt, setShowClockInPrompt] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [missedEntry, setMissedEntry] = useState<TimecardEntry | null>(null);
  const [missedClockOut, setMissedClockOut] = useState("");
  const [missedReason, setMissedReason] = useState("");
  const [showMissedDialog, setShowMissedDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [weekSubmitted, setWeekSubmitted] = useState(false);
  const [pastWeeks, setPastWeeks] = useState<TimecardWeek[]>([]);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [pastEntries, setPastEntries] = useState<Record<string, TimecardEntry[]>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const notifiedRef = useRef(false);

  const weekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const weekEnd = useMemo(() => endOfWeek(new Date(), { weekStartsOn: 1 }), []);

  const invokeClockAction = async (actionBody: any) => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("timecard-clock", { body: actionBody });
      if (error) throw error;
      return data;
    } finally {
      setActionLoading(false);
    }
  };

  const fetchEntries = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("timecard_entries")
      .select("*")
      .eq("user_id", userId)
      .gte("clock_in", weekStart.toISOString())
      .lte("clock_in", weekEnd.toISOString())
      .order("clock_in", { ascending: true });

    if (error) { console.error("Failed to fetch entries:", error); return; }
    const typedData = (data || []) as unknown as TimecardEntry[];
    setEntries(typedData);

    const active = typedData.find((e) => !e.clock_out && e.entry_type === "clock");
    if (active && isToday(parseISO(active.clock_in))) {
      setActiveEntry(active);
      // Check for active break
      const { data: breaks } = await supabase
        .from("timecard_breaks")
        .select("*")
        .eq("entry_id", active.id)
        .is("break_end", null)
        .limit(1);
      if (breaks && breaks.length > 0) {
        setActiveBreak(breaks[0] as unknown as TimecardBreak);
      } else {
        setActiveBreak(null);
      }
    } else {
      setActiveEntry(null);
      setActiveBreak(null);
    }

    setWeekSubmitted(typedData.length > 0 && typedData.every((e) => e.week_submitted));

    const missed = typedData.find((e) => !e.clock_out && !isToday(parseISO(e.clock_in)) && e.entry_type === "clock");
    if (missed) { setMissedEntry(missed); setShowMissedDialog(true); }
  }, [weekStart, weekEnd]);

  const fetchPastWeeks = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("timecard_weeks")
      .select("*")
      .eq("user_id", userId)
      .eq("submitted", true)
      .order("week_start", { ascending: false })
      .limit(12);
    if (data) setPastWeeks(data as unknown as TimecardWeek[]);
  }, []);

  const fetchPastWeekEntries = async (userId: string, ws: string, we: string) => {
    const { data } = await supabase
      .from("timecard_entries")
      .select("*")
      .eq("user_id", userId)
      .gte("clock_in", ws)
      .lte("clock_in", we)
      .order("clock_in", { ascending: true });
    if (data) setPastEntries((prev) => ({ ...prev, [ws]: data as unknown as TimecardEntry[] }));
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth/customer"); return; }
      setUser(session.user);
      const name = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Staff";
      setUserName(name);
      await fetchEntries(session.user.id);
      await fetchPastWeeks(session.user.id);
      setLoading(false);

      const { data: todayEntries } = await supabase
        .from("timecard_entries").select("id").eq("user_id", session.user.id)
        .gte("clock_in", startOfDay(new Date()).toISOString()).limit(1);
      if (!todayEntries || todayEntries.length === 0) setShowClockInPrompt(true);
    };
    checkAuth();
  }, [navigate, fetchEntries, fetchPastWeeks]);

  // Live timer
  useEffect(() => {
    if (!activeEntry) return;
    const interval = setInterval(() => {
      setElapsedSeconds(differenceInSeconds(new Date(), parseISO(activeEntry.clock_in)));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeEntry]);

  // Break timer
  useEffect(() => {
    if (!activeBreak) { setBreakElapsed(0); return; }
    const interval = setInterval(() => {
      setBreakElapsed(differenceInSeconds(new Date(), parseISO(activeBreak.break_start)));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeBreak]);

  // Browser notification at 6PM
  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    const checkTime = setInterval(() => {
      if (!activeEntry || notifiedRef.current) return;
      const now = new Date();
      if (now.getHours() >= 18) {
        const lastNotified = localStorage.getItem("timecard_notify_date");
        const today = format(now, "yyyy-MM-dd");
        if (lastNotified !== today && Notification.permission === "granted") {
          new Notification("LASO Timecard", { body: "Don't forget to clock out!", icon: "/favicon.png" });
          localStorage.setItem("timecard_notify_date", today);
          notifiedRef.current = true;
        }
      }
    }, 60000);
    return () => clearInterval(checkTime);
  }, [activeEntry]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const calcHours = (entry: TimecardEntry) => {
    if (!entry.clock_out) return 0;
    const raw = differenceInSeconds(parseISO(entry.clock_out), parseISO(entry.clock_in)) / 3600;
    return Math.max(0, raw - (entry.break_minutes || 0) / 60);
  };

  const totalWeeklyHours = entries.reduce((sum, e) => sum + calcHours(e), 0)
    + (activeEntry ? elapsedSeconds / 3600 : 0);

  const progressPercent = Math.min((totalWeeklyHours / 40) * 100, 100);
  const isWeeklyOvertime = totalWeeklyHours > 40;

  const handleClockIn = async () => {
    if (!user) return;
    try {
      const data = await invokeClockAction({ action: "clock_in", notes: clockInNote || null });
      toast.success("Clocked in successfully!");
      setClockInNote("");
      setShowClockInPrompt(false);
      fetchEntries(user.id);
    } catch (e: any) {
      toast.error("Failed to clock in: " + e.message);
    }
  };

  const handleClockOut = async () => {
    if (!activeEntry || !user) return;
    try {
      await invokeClockAction({ action: "clock_out", entry_id: activeEntry.id });
      toast.success("Clocked out successfully!");
      setActiveEntry(null);
      setActiveBreak(null);
      setElapsedSeconds(0);
      fetchEntries(user.id);
    } catch (e: any) {
      toast.error("Failed to clock out: " + e.message);
    }
  };

  const handleBreakStart = async () => {
    if (!activeEntry || !user) return;
    try {
      await invokeClockAction({ action: "break_start", entry_id: activeEntry.id });
      toast.success("Break started!");
      fetchEntries(user.id);
    } catch (e: any) {
      toast.error("Failed to start break: " + e.message);
    }
  };

  const handleBreakEnd = async () => {
    if (!activeEntry || !user) return;
    try {
      await invokeClockAction({ action: "break_end", entry_id: activeEntry.id });
      toast.success("Break ended!");
      setActiveBreak(null);
      setBreakElapsed(0);
      fetchEntries(user.id);
    } catch (e: any) {
      toast.error("Failed to end break: " + e.message);
    }
  };

  const handleLogDay = async (type: string) => {
    if (!user) return;
    try {
      await invokeClockAction({ action: "log_day", entry_type: type });
      toast.success(`${type.toUpperCase()} day logged!`);
      fetchEntries(user.id);
    } catch (e: any) {
      toast.error("Failed to log day: " + e.message);
    }
  };

  const handleFixMissed = async () => {
    if (!missedEntry || !missedClockOut || !user || !missedReason) return;
    try {
      const clockOutDate = new Date(`${format(parseISO(missedEntry.clock_in), "yyyy-MM-dd")}T${missedClockOut}`);
      if (isBefore(clockOutDate, parseISO(missedEntry.clock_in))) {
        toast.error("Clock out must be after clock in");
        return;
      }
      await invokeClockAction({
        action: "fix_missed", entry_id: missedEntry.id,
        manual_time: clockOutDate.toISOString(), edit_reason: missedReason,
      });
      toast.success("Missed clock-out updated!");
      setShowMissedDialog(false);
      setMissedEntry(null);
      setMissedClockOut("");
      setMissedReason("");
      fetchEntries(user.id);
    } catch (e: any) {
      toast.error("Failed to update: " + e.message);
    }
  };

  const handleSubmitTimecard = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await invokeClockAction({
        action: "submit_week",
        entry_ids: entries.map((e) => e.id),
        week_start: format(weekStart, "yyyy-MM-dd"),
        week_end: format(weekEnd, "yyyy-MM-dd"),
        total_hours: totalWeeklyHours.toFixed(2),
      });

      // Generate PDF and send email (fire-and-forget)
      const emailBody = {
        staffName: userName,
        staffEmail: user.email,
        weekStart: format(weekStart, "MMM d, yyyy"),
        weekEnd: format(weekEnd, "MMM d, yyyy"),
        entries: entries.map((e) => ({
          date: format(parseISO(e.clock_in), "EEE, MMM d"),
          clockIn: e.entry_type !== "clock" ? "" : format(parseISO(e.clock_in), "h:mm a"),
          clockOut: e.entry_type !== "clock" ? "" : (e.clock_out ? format(parseISO(e.clock_out), "h:mm a") : "—"),
          breakMinutes: e.break_minutes || 0,
          hours: calcHours(e).toFixed(2),
          notes: e.notes || "",
          tag: e.entry_type,
        })),
        totalHours: totalWeeklyHours.toFixed(2),
      };

      // Get PDF first, then send email with it
      supabase.functions.invoke("generate-timecard-pdf", { body: emailBody })
        .then(({ data: pdfData }) => {
          return supabase.functions.invoke("send-staff-timecard", {
            body: { ...emailBody, pdfBase64: pdfData?.base64 },
          });
        })
        .catch((err) => console.error("Email/PDF error:", err));

      toast.success("Timecard submitted successfully!");
      setShowSubmitConfirm(false);
      setWeekSubmitted(true);
      fetchEntries(user.id);
      fetchPastWeeks(user.id);
    } catch (e: any) {
      toast.error("Failed to submit: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{greeting}, {userName}</h1>
            <p className="text-slate-400 text-sm mt-1">
              Week of {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
            </p>
          </div>
          {weekSubmitted && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-sm px-3 py-1">
              ✓ Submitted
            </Badge>
          )}
        </div>

        {/* Missed Clock-Out Banner */}
        {missedEntry && !showMissedDialog && (
          <Card className="border-amber-500/50 bg-amber-500/10 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-amber-200 text-sm font-medium">
                  You forgot to clock out on {format(parseISO(missedEntry.clock_in), "EEEE, MMM d")}.
                </p>
              </div>
              <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
                onClick={() => setShowMissedDialog(true)}>Fix Now</Button>
            </CardContent>
          </Card>
        )}

        {/* Weekly Progress Bar */}
        <Card className="bg-white/5 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Week Progress</span>
              <span className={`text-sm font-bold ${isWeeklyOvertime ? "text-amber-400" : "text-emerald-400"}`}>
                {totalWeeklyHours.toFixed(1)} of 40 hrs
                {isWeeklyOvertime && <AlertCircle className="inline h-4 w-4 ml-1 text-red-400" />}
              </span>
            </div>
            <Progress
              value={progressPercent}
              className={`h-3 ${isWeeklyOvertime ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`}
            />
            {isWeeklyOvertime && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {(totalWeeklyHours - 40).toFixed(1)} overtime hours this week
              </p>
            )}
          </CardContent>
        </Card>

        {/* Clock In/Out Card */}
        <Card className="bg-white/5 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-center flex-1">
                {activeEntry ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className={`h-3 w-3 rounded-full ${activeBreak ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`} />
                      <span className={`text-sm font-medium ${activeBreak ? "text-amber-400" : "text-emerald-400"}`}>
                        {activeBreak ? "On Break" : "Currently Clocked In"}
                      </span>
                    </div>
                    <div className="text-5xl md:text-6xl font-mono font-bold text-white tracking-wider">
                      {formatDuration(activeBreak ? breakElapsed : elapsedSeconds)}
                    </div>
                    <p className="text-slate-400 text-sm mt-2">
                      Since {format(parseISO(activeEntry.clock_in), "h:mm a")}
                    </p>
                    {activeBreak && (
                      <p className="text-amber-400 text-xs mt-1">Break started at {format(parseISO(activeBreak.break_start), "h:mm a")}</p>
                    )}
                  </>
                ) : (
                  <>
                    <Timer className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400">Not clocked in</p>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                {!activeEntry ? (
                  <>
                    <Input placeholder="Add a note (optional)" value={clockInNote}
                      onChange={(e) => setClockInNote(e.target.value)}
                      className="bg-white/5 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={weekSubmitted} />
                    <Button onClick={handleClockIn} disabled={weekSubmitted || actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/20">
                      <LogIn className="h-5 w-5 mr-2" />Clock In
                    </Button>
                    {/* PTO / Sick / Holiday buttons */}
                    {!weekSubmitted && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleLogDay("pto")}
                          disabled={actionLoading}
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/50">
                          <Palmtree className="h-3 w-3 mr-1" />PTO
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogDay("sick")}
                          disabled={actionLoading}
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/50">
                          <Heart className="h-3 w-3 mr-1" />Sick
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogDay("holiday")}
                          disabled={actionLoading}
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/50">
                          <CalendarDays className="h-3 w-3 mr-1" />Holiday
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {!activeBreak ? (
                      <Button onClick={handleBreakStart} disabled={actionLoading}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-4 font-semibold rounded-xl">
                        <Coffee className="h-4 w-4 mr-2" />Start Break
                      </Button>
                    ) : (
                      <Button onClick={handleBreakEnd} disabled={actionLoading}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 font-semibold rounded-xl animate-pulse">
                        <CoffeeIcon className="h-4 w-4 mr-2" />End Break
                      </Button>
                    )}
                    <Button onClick={handleClockOut} disabled={!!activeBreak || actionLoading}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-red-500/20">
                      <LogOut className="h-5 w-5 mr-2" />Clock Out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card className="bg-white/5 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />Weekly Summary
              </CardTitle>
              <div className="text-right">
                <p className={`text-2xl font-bold ${isWeeklyOvertime ? "text-red-400" : "text-white"}`}>
                  {totalWeeklyHours.toFixed(1)}h
                  {isWeeklyOvertime && <AlertCircle className="inline h-4 w-4 ml-1" />}
                </p>
                <p className="text-xs text-slate-400">Total Hours</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border border-slate-700/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700/50 hover:bg-transparent">
                    <TableHead className="text-slate-400">Date</TableHead>
                    <TableHead className="text-slate-400">Clock In</TableHead>
                    <TableHead className="text-slate-400">Clock Out</TableHead>
                    <TableHead className="text-slate-400">Break</TableHead>
                    <TableHead className="text-slate-400 text-right">Hours</TableHead>
                    <TableHead className="text-slate-400 hidden md:table-cell">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length === 0 ? (
                    <TableRow className="border-slate-700/50">
                      <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                        No entries this week. Clock in to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    entries.map((entry) => {
                      const hours = calcHours(entry);
                      const isDailyOT = hours > 8;
                      const isTagDay = entry.entry_type !== "clock";
                      const tagColors: Record<string, string> = {
                        pto: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                        sick: "bg-rose-500/20 text-rose-300 border-rose-500/30",
                        holiday: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                      };
                      return (
                        <TableRow key={entry.id}
                          className={`border-slate-700/50 ${isDailyOT ? "bg-amber-500/10" : ""}`}>
                          <TableCell className="text-white font-medium">
                            {format(parseISO(entry.clock_in), "EEE, MMM d")}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {isTagDay ? (
                              <Badge className={tagColors[entry.entry_type] || ""}>{entry.entry_type.toUpperCase()}</Badge>
                            ) : format(parseISO(entry.clock_in), "h:mm a")}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {isTagDay ? "—" : entry.clock_out ? format(parseISO(entry.clock_out), "h:mm a") : (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Active</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">
                            {(entry.break_minutes || 0) > 0 ? `${entry.break_minutes}min` : "—"}
                          </TableCell>
                          <TableCell className={`text-right font-medium ${isDailyOT ? "text-amber-400" : "text-white"}`}>
                            {hours > 0 ? hours.toFixed(2) : "—"}
                            {isDailyOT && <AlertTriangle className="inline h-3 w-3 ml-1" />}
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm hidden md:table-cell max-w-[200px] truncate">
                            {entry.notes || "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {entries.length > 0 && !weekSubmitted && !activeEntry && (
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowSubmitConfirm(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base font-semibold rounded-xl">
                  <Send className="h-4 w-4 mr-2" />Submit Timecard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Timecards */}
        {pastWeeks.length > 0 && (
          <Collapsible>
            <Card className="bg-white/5 border-slate-700/50 backdrop-blur-sm">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="pb-3 cursor-pointer hover:bg-white/5 transition-colors rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />Past Timecards
                    </CardTitle>
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0">
                  {pastWeeks.map((week) => (
                    <Collapsible key={week.id} open={expandedWeek === week.id}
                      onOpenChange={(open) => {
                        setExpandedWeek(open ? week.id : null);
                        if (open && !pastEntries[week.week_start]) {
                          fetchPastWeekEntries(user.id, week.week_start, week.week_end);
                        }
                      }}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-white">
                              Week of {format(parseISO(week.week_start), "MMM d")} – {format(parseISO(week.week_end), "MMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">{week.total_hours}h</span>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Submitted</Badge>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 rounded-lg border border-slate-700/50 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-slate-700/50 hover:bg-transparent">
                                <TableHead className="text-slate-400 text-xs">Date</TableHead>
                                <TableHead className="text-slate-400 text-xs">In</TableHead>
                                <TableHead className="text-slate-400 text-xs">Out</TableHead>
                                <TableHead className="text-slate-400 text-xs text-right">Hours</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(pastEntries[week.week_start] || []).map((e) => (
                                <TableRow key={e.id} className="border-slate-700/50">
                                  <TableCell className="text-white text-sm py-2">{format(parseISO(e.clock_in), "EEE, MMM d")}</TableCell>
                                  <TableCell className="text-slate-300 text-sm py-2">
                                    {e.entry_type !== "clock" ? e.entry_type.toUpperCase() : format(parseISO(e.clock_in), "h:mm a")}
                                  </TableCell>
                                  <TableCell className="text-slate-300 text-sm py-2">
                                    {e.entry_type !== "clock" ? "—" : (e.clock_out ? format(parseISO(e.clock_out), "h:mm a") : "—")}
                                  </TableCell>
                                  <TableCell className="text-white text-sm text-right py-2">{calcHours(e).toFixed(2)}h</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button size="sm" variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-white/10"
                            onClick={() => {
                              supabase.functions.invoke("generate-timecard-pdf", {
                                body: {
                                  staffName: userName, staffEmail: user.email,
                                  weekStart: format(parseISO(week.week_start), "MMM d, yyyy"),
                                  weekEnd: format(parseISO(week.week_end), "MMM d, yyyy"),
                                  entries: (pastEntries[week.week_start] || []).map((e) => ({
                                    date: format(parseISO(e.clock_in), "EEE, MMM d"),
                                    clockIn: e.entry_type !== "clock" ? "" : format(parseISO(e.clock_in), "h:mm a"),
                                    clockOut: e.entry_type !== "clock" ? "" : (e.clock_out ? format(parseISO(e.clock_out), "h:mm a") : "—"),
                                    breakMinutes: e.break_minutes || 0,
                                    hours: calcHours(e).toFixed(2),
                                    notes: e.notes || "",
                                    tag: e.entry_type,
                                  })),
                                  totalHours: String(week.total_hours),
                                },
                              }).then(({ data }) => {
                                if (data?.html) {
                                  const blob = new Blob([data.html], { type: "text/html" });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = `timecard-${format(parseISO(week.week_start), "yyyy-MM-dd")}.html`;
                                  a.click();
                                  URL.revokeObjectURL(url);
                                }
                              });
                            }}>
                            <Download className="h-3 w-3 mr-1" />Download
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}
      </div>

      {/* Clock-In Prompt Dialog */}
      <Dialog open={showClockInPrompt && !activeEntry && !weekSubmitted} onOpenChange={setShowClockInPrompt}>
        <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{greeting}, {userName}! 👋</DialogTitle>
            <DialogDescription className="text-slate-400">Would you like to clock in for today?</DialogDescription>
          </DialogHeader>
          <Input placeholder="Add a note (optional)" value={clockInNote}
            onChange={(e) => setClockInNote(e.target.value)}
            className="bg-white/5 border-slate-600 text-white placeholder:text-slate-500" />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setShowClockInPrompt(false)}
              className="text-slate-400 hover:text-white hover:bg-slate-700">Not Yet</Button>
            <Button onClick={handleClockIn} disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <LogIn className="h-4 w-4 mr-2" />Clock In Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Missed Clock-Out Dialog */}
      <Dialog open={showMissedDialog} onOpenChange={setShowMissedDialog}>
        <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />Missed Clock-Out
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {missedEntry && <>You forgot to clock out on {format(parseISO(missedEntry.clock_in), "EEEE, MMM d")}.</>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Clock Out Time</label>
              <Input type="time" value={missedClockOut} onChange={(e) => setMissedClockOut(e.target.value)}
                className="bg-white/5 border-slate-600 text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Reason for edit (required)</label>
              <Input value={missedReason} onChange={(e) => setMissedReason(e.target.value)}
                placeholder="e.g. Forgot to clock out" className="bg-white/5 border-slate-600 text-white placeholder:text-slate-500" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleFixMissed} disabled={!missedClockOut || !missedReason || actionLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground">Update Clock-Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <AlertDialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Submit Timecard?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Submitting for {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}.
              {isWeeklyOvertime && <span className="text-amber-400 block mt-1">⚠️ Overtime: {(totalWeeklyHours - 40).toFixed(1)} extra hours.</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-lg border border-slate-700/50 overflow-hidden my-2">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50 hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs">Date</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => {
                  const h = calcHours(e);
                  return (
                    <TableRow key={e.id} className={`border-slate-700/50 ${h > 8 ? "bg-amber-500/10" : ""}`}>
                      <TableCell className="text-white text-sm py-2">
                        {format(parseISO(e.clock_in), "EEE, MMM d")}
                        {e.entry_type !== "clock" && (
                          <Badge className="ml-2 text-[10px]" variant="secondary">{e.entry_type.toUpperCase()}</Badge>
                        )}
                      </TableCell>
                      <TableCell className={`text-sm text-right py-2 ${h > 8 ? "text-amber-400 font-bold" : "text-white"}`}>
                        {h.toFixed(2)}h
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="border-slate-700/50 bg-white/5">
                  <TableCell className="text-white font-bold text-sm py-2">Total</TableCell>
                  <TableCell className={`font-bold text-sm text-right py-2 ${isWeeklyOvertime ? "text-red-400" : "text-white"}`}>
                    {totalWeeklyHours.toFixed(2)}h
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitTimecard} disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {submitting ? "Submitting..." : "Confirm & Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffTimecard;
