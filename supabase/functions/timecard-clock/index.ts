import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let result: any = null;

    switch (action) {
      case "clock_in": {
        const { data, error } = await admin
          .from("timecard_entries")
          .insert({ user_id: user.id, clock_in: new Date().toISOString(), notes: body.notes || null, entry_type: "clock" })
          .select().single();
        if (error) throw error;
        result = data;
        await admin.from("timecard_audit_log").insert({
          timecard_entry_id: data.id, user_id: user.id, action: "clock_in", new_value: data.clock_in,
        });
        break;
      }

      case "clock_out": {
        if (!body.entry_id) throw new Error("entry_id required");
        const now = new Date().toISOString();
        // Calculate break_minutes
        const { data: breaks } = await admin.from("timecard_breaks")
          .select("break_start, break_end").eq("entry_id", body.entry_id);
        let totalBreakMin = 0;
        if (breaks) {
          for (const b of breaks) {
            if (b.break_start && b.break_end) {
              totalBreakMin += (new Date(b.break_end).getTime() - new Date(b.break_start).getTime()) / 60000;
            }
          }
        }
        const { data, error } = await admin.from("timecard_entries")
          .update({ clock_out: now, break_minutes: Math.round(totalBreakMin) })
          .eq("id", body.entry_id).eq("user_id", user.id).select().single();
        if (error) throw error;
        result = data;
        await admin.from("timecard_audit_log").insert({
          timecard_entry_id: body.entry_id, user_id: user.id, action: "clock_out", new_value: now,
        });
        break;
      }

      case "break_start": {
        if (!body.entry_id) throw new Error("entry_id required");
        const { data, error } = await admin.from("timecard_breaks")
          .insert({ entry_id: body.entry_id, user_id: user.id, break_start: new Date().toISOString() })
          .select().single();
        if (error) throw error;
        result = data;
        await admin.from("timecard_audit_log").insert({
          timecard_entry_id: body.entry_id, user_id: user.id, action: "break_start", new_value: data.break_start,
        });
        break;
      }

      case "break_end": {
        if (!body.entry_id) throw new Error("entry_id required");
        const { data: activeBreak } = await admin.from("timecard_breaks")
          .select("*").eq("entry_id", body.entry_id).eq("user_id", user.id)
          .is("break_end", null).order("break_start", { ascending: false }).limit(1).single();
        if (!activeBreak) throw new Error("No active break found");
        const now = new Date().toISOString();
        const { data, error } = await admin.from("timecard_breaks")
          .update({ break_end: now }).eq("id", activeBreak.id).select().single();
        if (error) throw error;
        result = data;
        await admin.from("timecard_audit_log").insert({
          timecard_entry_id: body.entry_id, user_id: user.id, action: "break_end", new_value: now,
        });
        break;
      }

      case "log_day": {
        const entryType = body.entry_type;
        if (!["pto", "sick", "holiday"].includes(entryType)) throw new Error("Invalid entry_type");
        const today = new Date();
        const clockIn = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0);
        const clockOut = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0, 0);
        const { data, error } = await admin.from("timecard_entries")
          .insert({
            user_id: user.id, clock_in: clockIn.toISOString(), clock_out: clockOut.toISOString(),
            entry_type: entryType, notes: `${entryType.toUpperCase()} Day`,
          }).select().single();
        if (error) throw error;
        result = data;
        await admin.from("timecard_audit_log").insert({
          timecard_entry_id: data.id, user_id: user.id, action: "clock_in",
          new_value: `${entryType} day logged`,
        });
        break;
      }

      case "fix_missed": {
        if (!body.entry_id || !body.manual_time) throw new Error("entry_id and manual_time required");
        if (!body.edit_reason) throw new Error("edit_reason required for manual edits");
        const { data: old } = await admin.from("timecard_entries")
          .select("clock_out").eq("id", body.entry_id).eq("user_id", user.id).single();
        const { data, error } = await admin.from("timecard_entries")
          .update({ clock_out: body.manual_time }).eq("id", body.entry_id).eq("user_id", user.id)
          .select().single();
        if (error) throw error;
        result = data;
        await admin.from("timecard_audit_log").insert({
          timecard_entry_id: body.entry_id, user_id: user.id, action: "edit",
          old_value: old?.clock_out || null, new_value: body.manual_time, edit_reason: body.edit_reason,
        });
        break;
      }

      case "submit_week": {
        const { entry_ids, week_start, week_end, total_hours } = body;
        const { error: updateError } = await admin.from("timecard_entries")
          .update({ week_submitted: true }).in("id", entry_ids);
        if (updateError) throw updateError;
        await admin.from("timecard_weeks").upsert({
          user_id: user.id, week_start, week_end,
          total_hours: parseFloat(total_hours || "0"),
          submitted: true, submitted_at: new Date().toISOString(), locked: true,
        }, { onConflict: "user_id,week_start" });
        await admin.from("timecard_audit_log").insert({
          user_id: user.id, action: "submitted",
          new_value: `Week ${week_start} to ${week_end}: ${total_hours}h`,
        });
        result = { success: true };
        break;
      }

      case "admin_unlock": {
        // Verify caller is admin
        const { data: isAdmin } = await admin.from("admin_users")
          .select("id").eq("user_id", user.id).limit(1).single();
        if (!isAdmin) throw new Error("Admin access required");
        const { target_user_id, week_start } = body;
        await admin.from("timecard_weeks")
          .update({ locked: false, submitted: false })
          .eq("user_id", target_user_id).eq("week_start", week_start);
        await admin.from("timecard_entries")
          .update({ week_submitted: false, locked_by_admin: false, unlocked_at: new Date().toISOString() })
          .eq("user_id", target_user_id)
          .gte("clock_in", week_start)
          .lte("clock_in", body.week_end);
        await admin.from("timecard_audit_log").insert({
          user_id: user.id, action: "unlocked",
          new_value: `Admin unlocked week ${week_start} for user ${target_user_id}`,
        });
        result = { success: true };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("timecard-clock error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
