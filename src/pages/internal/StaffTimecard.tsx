import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Clock, LogIn, LogOut, Send, AlertTriangle, Timer } from "lucide-react";
import { format, startOfWeek, endOfWeek, differenceInSeconds, parseISO, isBefore, startOfDay, isToday } from "date-fns";

interface TimecardEntry {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out: string | null;
  notes: string | null;
  week_submitted: boolean;
  created_at: string;
}

const StaffTimecard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<TimecardEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimecardEntry | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [clockInNote, setClockInNote] = useState("");
  const [showClockInPrompt, setShowClockInPrompt] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [missedEntry, setMissedEntry] = useState<TimecardEntry | null>(null);
  const [missedClockOut, setMissedClockOut] = useState("");
  const [showMissedDialog, setShowMissedDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [weekSubmitted, setWeekSubmitted] = useState(false);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const fetchEntries = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("timecard_entries")
      .select("*")
      .eq("user_id", userId)
      .gte("clock_in", weekStart.toISOString())
      .lte("clock_in", weekEnd.toISOString())
      .order("clock_in", { ascending: true });

    if (error) {
      console.error("Failed to fetch entries:", error);
      return;
    }

    const typedData = (data || []) as TimecardEntry[];
    setEntries(typedData);

    const active = typedData.find((e) => !e.clock_out);
    if (active && isToday(parseISO(active.clock_in))) {
      setActiveEntry(active);
    } else {
      setActiveEntry(null);
    }

    setWeekSubmitted(typedData.length > 0 && typedData.every((e) => e.week_submitted));

    // Check for missed clock-outs (open entries from previous days)
    const missed = typedData.find(
      (e) => !e.clock_out && !isToday(parseISO(e.clock_in))
    );
    if (missed) {
      setMissedEntry(missed);
      setShowMissedDialog(true);
    }
  }, [weekStart, weekEnd]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth/customer");
        return;
      }
      setUser(session.user);
      const name = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Staff";
      setUserName(name);
      await fetchEntries(session.user.id);
      setLoading(false);

      // Show clock-in prompt if no active entry today
      const { data: todayEntries } = await supabase
        .from("timecard_entries")
        .select("id")
        .eq("user_id", session.user.id)
        .gte("clock_in", startOfDay(new Date()).toISOString())
        .limit(1);

      if (!todayEntries || todayEntries.length === 0) {
        setShowClockInPrompt(true);
      }
    };
    checkAuth();
  }, [navigate, fetchEntries]);

  // Live timer
  useEffect(() => {
    if (!activeEntry) return;
    const interval = setInterval(() => {
      setElapsedSeconds(differenceInSeconds(new Date(), parseISO(activeEntry.clock_in)));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeEntry]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const calcHours = (entry: TimecardEntry) => {
    if (!entry.clock_out) return 0;
    return differenceInSeconds(parseISO(entry.clock_out), parseISO(entry.clock_in)) / 3600;
  };

  const totalWeeklyHours = entries.reduce((sum, e) => sum + calcHours(e), 0);

  const handleClockIn = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("timecard_entries")
      .insert({ user_id: user.id, clock_in: new Date().toISOString(), notes: clockInNote || null })
      .select()
      .single();

    if (error) {
      toast.error("Failed to clock in");
      console.error(error);
      return;
    }
    toast.success("Clocked in successfully!");
    setActiveEntry(data as TimecardEntry);
    setClockInNote("");
    setShowClockInPrompt(false);
    fetchEntries(user.id);
  };

  const handleClockOut = async () => {
    if (!activeEntry || !user) return;
    const { error } = await supabase
      .from("timecard_entries")
      .update({ clock_out: new Date().toISOString() })
      .eq("id", activeEntry.id);

    if (error) {
      toast.error("Failed to clock out");
      return;
    }
    toast.success("Clocked out successfully!");
    setActiveEntry(null);
    setElapsedSeconds(0);
    fetchEntries(user.id);
  };

  const handleFixMissed = async () => {
    if (!missedEntry || !missedClockOut || !user) return;
    const clockOutDate = new Date(`${format(parseISO(missedEntry.clock_in), "yyyy-MM-dd")}T${missedClockOut}`);
    if (isBefore(clockOutDate, parseISO(missedEntry.clock_in))) {
      toast.error("Clock out time must be after clock in time");
      return;
    }
    const { error } = await supabase
      .from("timecard_entries")
      .update({ clock_out: clockOutDate.toISOString() })
      .eq("id", missedEntry.id);

    if (error) {
      toast.error("Failed to update missed entry");
      return;
    }
    toast.success("Missed clock-out updated!");
    setShowMissedDialog(false);
    setMissedEntry(null);
    setMissedClockOut("");
    fetchEntries(user.id);
  };

  const handleSubmitTimecard = async () => {
    if (!user) return;
    setSubmitting(true);

    // Mark all entries as submitted
    const ids = entries.map((e) => e.id);
    const { error: updateError } = await supabase
      .from("timecard_entries")
      .update({ week_submitted: true })
      .in("id", ids);

    if (updateError) {
      toast.error("Failed to submit timecard");
      setSubmitting(false);
      return;
    }

    // Send email notification (fire-and-forget)
    const emailBody = {
      staffName: userName,
      staffEmail: user.email,
      weekStart: format(weekStart, "MMM d, yyyy"),
      weekEnd: format(weekEnd, "MMM d, yyyy"),
      entries: entries.map((e) => ({
        date: format(parseISO(e.clock_in), "EEE, MMM d"),
        clockIn: format(parseISO(e.clock_in), "h:mm a"),
        clockOut: e.clock_out ? format(parseISO(e.clock_out), "h:mm a") : "—",
        hours: calcHours(e).toFixed(2),
        notes: e.notes || "",
      })),
      totalHours: totalWeeklyHours.toFixed(2),
    };

    supabase.functions
      .invoke("send-staff-timecard", { body: emailBody })
      .then(({ error }) => {
        if (error) console.error("Email notification failed:", error);
      })
      .catch((err) => console.error("Email notification error:", err));

    toast.success("Timecard submitted successfully!");
    setShowSubmitConfirm(false);
    setWeekSubmitted(true);
    setSubmitting(false);
    fetchEntries(user.id);
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
              <Button
                size="sm"
                variant="outline"
                className="border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
                onClick={() => setShowMissedDialog(true)}
              >
                Fix Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Clock In/Out Card */}
        <Card className="bg-white/5 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Timer Display */}
              <div className="text-center flex-1">
                {activeEntry ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 text-sm font-medium">Currently Clocked In</span>
                    </div>
                    <div className="text-5xl md:text-6xl font-mono font-bold text-white tracking-wider">
                      {formatDuration(elapsedSeconds)}
                    </div>
                    <p className="text-slate-400 text-sm mt-2">
                      Since {format(parseISO(activeEntry.clock_in), "h:mm a")}
                    </p>
                  </>
                ) : (
                  <>
                    <Timer className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400">Not clocked in</p>
                  </>
                )}
              </div>

              {/* Action Button */}
              <div className="flex flex-col gap-3 w-full md:w-auto">
                {!activeEntry ? (
                  <>
                    <Input
                      placeholder="Add a note (optional)"
                      value={clockInNote}
                      onChange={(e) => setClockInNote(e.target.value)}
                      className="bg-white/5 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={weekSubmitted}
                    />
                    <Button
                      onClick={handleClockIn}
                      disabled={weekSubmitted}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Clock In
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleClockOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Clock Out
                  </Button>
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
                <Clock className="h-5 w-5 text-primary" />
                Weekly Summary
              </CardTitle>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{totalWeeklyHours.toFixed(1)}h</p>
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
                    <TableHead className="text-slate-400 text-right">Hours</TableHead>
                    <TableHead className="text-slate-400 hidden md:table-cell">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length === 0 ? (
                    <TableRow className="border-slate-700/50">
                      <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                        No entries this week. Clock in to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    entries.map((entry) => {
                      const hours = calcHours(entry);
                      return (
                        <TableRow key={entry.id} className="border-slate-700/50">
                          <TableCell className="text-white font-medium">
                            {format(parseISO(entry.clock_in), "EEE, MMM d")}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {format(parseISO(entry.clock_in), "h:mm a")}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {entry.clock_out ? (
                              format(parseISO(entry.clock_out), "h:mm a")
                            ) : (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-white font-medium">
                            {hours > 0 ? hours.toFixed(2) : "—"}
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

            {/* Submit Button */}
            {entries.length > 0 && !weekSubmitted && !activeEntry && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base font-semibold rounded-xl"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Timecard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Clock-In Prompt Dialog */}
      <Dialog open={showClockInPrompt && !activeEntry && !weekSubmitted} onOpenChange={setShowClockInPrompt}>
        <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{greeting}, {userName}! 👋</DialogTitle>
            <DialogDescription className="text-slate-400">
              Would you like to clock in for today?
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Add a note (optional)"
            value={clockInNote}
            onChange={(e) => setClockInNote(e.target.value)}
            className="bg-white/5 border-slate-600 text-white placeholder:text-slate-500"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setShowClockInPrompt(false)} className="text-slate-400 hover:text-white hover:bg-slate-700">
              Not Yet
            </Button>
            <Button onClick={handleClockIn} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <LogIn className="h-4 w-4 mr-2" />
              Clock In Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Missed Clock-Out Dialog */}
      <Dialog open={showMissedDialog} onOpenChange={setShowMissedDialog}>
        <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Missed Clock-Out
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {missedEntry && (
                <>You forgot to clock out on {format(parseISO(missedEntry.clock_in), "EEEE, MMM d")}. Please enter the time you stopped working.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Clock Out Time</label>
            <Input
              type="time"
              value={missedClockOut}
              onChange={(e) => setMissedClockOut(e.target.value)}
              className="bg-white/5 border-slate-600 text-white"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleFixMissed} disabled={!missedClockOut} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Update Clock-Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <AlertDialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Submit Timecard?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              You're submitting your timecard for the week of {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}.
              A summary will be emailed to you and admin. This cannot be undone.
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
                {entries.map((e) => (
                  <TableRow key={e.id} className="border-slate-700/50">
                    <TableCell className="text-white text-sm py-2">{format(parseISO(e.clock_in), "EEE, MMM d")}</TableCell>
                    <TableCell className="text-white text-sm text-right py-2">{calcHours(e).toFixed(2)}h</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-slate-700/50 bg-white/5">
                  <TableCell className="text-white font-bold text-sm py-2">Total</TableCell>
                  <TableCell className="text-white font-bold text-sm text-right py-2">{totalWeeklyHours.toFixed(2)}h</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitTimecard}
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {submitting ? "Submitting..." : "Confirm & Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffTimecard;
