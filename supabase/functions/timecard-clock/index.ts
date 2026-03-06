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
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, entry_id, notes, edit_reason, manual_time } = await req.json();

    // Use service role for DB operations to set server-side timestamps
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let result: any = null;

    switch (action) {
      case "clock_in": {
        const { data, error } = await adminClient
          .from("timecard_entries")
          .insert({
            user_id: user.id,
            clock_in: new Date().toISOString(),
            notes: notes || null,
            entry_type: "clock",
          })
          .select()
          .single();
        if (error) throw error;
        result = data;

        await adminClient.from("timecard_audit_log").insert({
          timecard_entry_id: data.id,
          user_id: user.id,
          action: "clock_in",
          new_value: data.clock_in,
        });
        break;
      }

      case "clock_out": {
        if (!entry_id) throw new Error("entry_id required for clock_out");
        const now = new Date().toISOString();
        const { data, error } = await adminClient
          .from("timecard_entries")
          .update({ clock_out: now })
          .eq("id", entry_id)
          .eq("user_id", user.id)
          .select()
          .single();
        if (error) throw error;
        result = data;

        // Calculate break_minutes from timecard_breaks
        const { data: breaks } = await adminClient
          .from("timecard_breaks")
          .select("break_start, break_end")
          .eq("entry_id", entry_id);
        
        let totalBreakMinutes = 0;
        if (breaks) {
          for (const b of breaks) {
            if (b.break_start && b.break_end) {
              totalBreakMinutes += (new Date(b.break_end).getTime() - new Date(b.break_start).getTime()) / 60000;
            }
          }
        }
        await adminClient
          .from("timecard_entries")
          .update({ break_minutes: Math.round(totalBreakMinutes) })
          .eq("id", entry_id);

        await adminClient.from("timecard_audit_log").insert({
          timecard_entry_id: entry_id,
          user_id: user.id,
          action: "clock_out",
          new_value: now,
        });
        break;
      }

      case "break_start": {
        if (!entry_id) throw new Error("entry_id required for break_start");
        const { data, error } = await adminClient
          .from("timecard_breaks")
          .insert({
            entry_id,
            user_id: user.id,
            break_start: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        result = data;

        await adminClient.from("timecard_audit_log").insert({
          timecard_entry_id: entry_id,
          user_id: user.id,
          action: "break_start",
          new_value: data.break_start,
        });
        break;
      }

      case "break_end": {
        if (!entry_id) throw new Error("entry_id required for break_end");
        // Find the active break for this entry
        const { data: activeBreak } = await adminClient
          .from("timecard_breaks")
          .select("*")
          .eq("entry_id", entry_id)
          .eq("user_id", user.id)
          .is("break_end", null)
          .single();

        if (!activeBreak) throw new Error("No active break found");

        const now = new Date().toISOString();
        const { data, error } = await adminClient
          .from("timecard_breaks")
          .update({ break_end: now })
          .eq("id", activeBreak.id)
          .select()
          .single();
        if (error) throw error;
        result = data;

        await adminClient.from("timecard_audit_log").insert({
          timecard_entry_id: entry_id,
          user_id: user.id,
          action: "break_end",
          new_value: now,
        });
        break;
      }

      case "log_day": {
        // PTO / Sick / Holiday — creates an 8h entry
        const { entry_type } = await req.json().catch(() => ({}));
        const entryType = notes; // reuse notes field to pass entry_type from client
        if (!["pto", "sick", "holiday"].includes(entryType)) {
          throw new Error("Invalid entry_type for log_day");
        }
        const today = new Date();
        today.setHours(9, 0, 0, 0);
        const endTime = new Date(today);
        endTime.setHours(17, 0, 0, 0);

        const { data, error } = await adminClient
          .from("timecard_entries")
          .insert({
            user_id: user.id,
            clock_in: today.toISOString(),
            clock_out: endTime.toISOString(),
            entry_type: entryType,
            notes: `${entryType.toUpperCase()} Day`,
          })
          .select()
          .single();
        if (error) throw error;
        result = data;

        await adminClient.from("timecard_audit_log").insert({
          timecard_entry_id: data.id,
          user_id: user.id,
          action: "clock_in",
          new_value: `${entryType} day logged`,
        });
        break;
      }

      case "fix_missed": {
        if (!entry_id || !manual_time) throw new Error("entry_id and manual_time required");
        if (!edit_reason) throw new Error("edit_reason required for manual edits");
        
        // Get old value
        const { data: oldEntry } = await adminClient
          .from("timecard_entries")
          .select("clock_out")
          .eq("id", entry_id)
          .eq("user_id", user.id)
          .single();

        const { data, error } = await adminClient
          .from("timecard_entries")
          .update({ clock_out: manual_time })
          .eq("id", entry_id)
          .eq("user_id", user.id)
          .select()
          .single();
        if (error) throw error;
        result = data;

        await adminClient.from("timecard_audit_log").insert({
          timecard_entry_id: entry_id,
          user_id: user.id,
          action: "edit",
          old_value: oldEntry?.clock_out || null,
          new_value: manual_time,
          edit_reason,
        });
        break;
      }

      case "submit_week": {
        const { entry_ids, week_start, week_end, total_hours } = await req.json().catch(() => ({}));
        // Use values from the original parse
        const body = JSON.parse(await new Response(req.body).text().catch(() => "{}"));
        
        // Mark entries as submitted
        const { error: updateError } = await adminClient
          .from("timecard_entries")
          .update({ week_submitted: true })
          .in("id", entry_id); // entry_id is actually entry_ids array here
        if (updateError) throw updateError;

        // Upsert timecard_weeks
        await adminClient.from("timecard_weeks").upsert({
          user_id: user.id,
          week_start: manual_time, // reused as week_start
          week_end: edit_reason, // reused as week_end
          total_hours: parseFloat(notes || "0"),
          submitted: true,
          submitted_at: new Date().toISOString(),
          locked: true,
        }, { onConflict: "user_id,week_start" });

        // Audit log
        await adminClient.from("timecard_audit_log").insert({
          user_id: user.id,
          action: "submitted",
          new_value: `Week ${manual_time} to ${edit_reason}: ${notes}h`,
        });

        result = { success: true };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("timecard-clock error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
