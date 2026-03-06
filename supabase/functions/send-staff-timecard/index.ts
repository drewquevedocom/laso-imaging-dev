import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EntryRow {
  date: string;
  clockIn: string;
  clockOut: string;
  breakMinutes?: number;
  hours: string;
  notes: string;
  tag?: string;
}

interface StaffTimecardRequest {
  staffName: string;
  staffEmail: string;
  weekStart: string;
  weekEnd: string;
  entries: EntryRow[];
  totalHours: string;
  pdfBase64?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: StaffTimecardRequest = await req.json();
    const isOvertime = parseFloat(data.totalHours) > 40;

    const rows = data.entries
      .map((e) => {
        const isTagDay = e.tag && e.tag !== "clock";
        const dailyHours = parseFloat(e.hours);
        const isDailyOT = dailyHours > 8;
        return `
        <tr${isDailyOT ? ' style="background:#fef3c7;"' : ""}>
          <td style="border:1px solid #ddd;padding:8px;">${e.date}</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:center;">
            ${isTagDay ? `<span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:12px;font-size:11px;">${(e.tag || "").toUpperCase()}</span>` : e.clockIn}
          </td>
          <td style="border:1px solid #ddd;padding:8px;text-align:center;">${isTagDay ? "—" : e.clockOut}</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:center;">${(e.breakMinutes || 0) > 0 ? e.breakMinutes + "min" : "—"}</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:right;${isDailyOT ? "color:#d97706;font-weight:bold;" : ""}">${e.hours}h${isDailyOT ? " ⚠️" : ""}</td>
          <td style="border:1px solid #ddd;padding:8px;">${e.notes || "—"}</td>
        </tr>`;
      })
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head><style>
  body{font-family:Arial,sans-serif;color:#333;line-height:1.6}
  .container{max-width:700px;margin:0 auto;padding:20px}
  .header{background:#1a365d;color:#fff;padding:20px;text-align:center;border-radius:8px 8px 0 0}
  table{width:100%;border-collapse:collapse;margin:16px 0}
  th{background:#1a365d;color:#fff;padding:10px;text-align:left}
  .total{background:${isOvertime ? "#fef2f2" : "#e8f4f8"};font-weight:bold}
  .footer{margin-top:24px;padding-top:16px;border-top:1px solid #ddd;font-size:12px;color:#666}
  .overtime-warning{background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:12px;margin:12px 0;color:#92400e}
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;font-size:22px;">Staff Timecard Submission</h1>
      <p style="margin:4px 0 0;">${data.staffName}</p>
    </div>
    <div style="padding:20px;background:#f9f9f9;border-radius:0 0 8px 8px">
      <p><strong>Week:</strong> ${data.weekStart} – ${data.weekEnd}</p>
      ${isOvertime ? '<div class="overtime-warning">⚠️ <strong>Overtime Alert:</strong> Total hours exceed 40 for this week.</div>' : ""}
      <table>
        <thead><tr>
          <th>Date</th><th>Clock In</th><th>Clock Out</th><th>Break</th><th>Hours</th><th>Notes</th>
        </tr></thead>
        <tbody>
          ${rows}
          <tr class="total">
            <td style="border:1px solid #ddd;padding:8px;" colspan="4"><strong>Total</strong></td>
            <td style="border:1px solid #ddd;padding:8px;text-align:right;${isOvertime ? "color:#dc2626;" : ""}"><strong>${data.totalHours}h</strong></td>
            <td style="border:1px solid #ddd;padding:8px;"></td>
          </tr>
        </tbody>
      </table>
      <div class="footer">
        <p>Submitted on ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} (Pacific Time)</p>
        <p>LASO Imaging Services – Staff Timecard System</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const recipients = ["info@lasoimaging.com"];
    if (data.staffEmail && !recipients.includes(data.staffEmail)) {
      recipients.push(data.staffEmail);
    }

    const emailPayload: any = {
      from: "LASO Imaging <updates@updates.lasoimaging.com>",
      to: recipients,
      subject: `Staff Timecard: ${data.staffName} – ${data.weekStart} to ${data.weekEnd}${isOvertime ? " [OVERTIME]" : ""}`,
      html,
    };

    // Attach PDF if provided
    if (data.pdfBase64) {
      emailPayload.attachments = [
        {
          filename: `timecard-${data.staffName.replace(/\s+/g, "-").toLowerCase()}-${data.weekStart}.html`,
          content: data.pdfBase64,
          type: "text/html",
        },
      ];
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const emailResponse = await res.json();
    if (!res.ok) throw new Error(emailResponse.message || "Failed to send email");

    console.log("Staff timecard email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-staff-timecard:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
