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
  hours: string;
  notes: string;
}

interface StaffTimecardRequest {
  staffName: string;
  staffEmail: string;
  weekStart: string;
  weekEnd: string;
  entries: EntryRow[];
  totalHours: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: StaffTimecardRequest = await req.json();

    const rows = data.entries
      .map(
        (e) => `
        <tr>
          <td style="border:1px solid #ddd;padding:8px;">${e.date}</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:center;">${e.clockIn}</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:center;">${e.clockOut}</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:right;">${e.hours}h</td>
          <td style="border:1px solid #ddd;padding:8px;">${e.notes || "—"}</td>
        </tr>`
      )
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
  .total{background:#e8f4f8;font-weight:bold}
  .footer{margin-top:24px;padding-top:16px;border-top:1px solid #ddd;font-size:12px;color:#666}
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;font-size:22px;">Staff Timecard Submission</h1>
      <p style="margin:4px 0 0;">${data.staffName}</p>
    </div>
    <div style="padding:20px;background:#f9f9f9;border-radius:0 0 8px 8px">
      <p><strong>Week:</strong> ${data.weekStart} – ${data.weekEnd}</p>
      <table>
        <thead><tr>
          <th>Date</th><th>Clock In</th><th>Clock Out</th><th>Hours</th><th>Notes</th>
        </tr></thead>
        <tbody>
          ${rows}
          <tr class="total">
            <td style="border:1px solid #ddd;padding:8px;" colspan="3"><strong>Total</strong></td>
            <td style="border:1px solid #ddd;padding:8px;text-align:right;"><strong>${data.totalHours}h</strong></td>
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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Imaging <updates@updates.lasoimaging.com>",
        to: recipients,
        subject: `Staff Timecard: ${data.staffName} – ${data.weekStart} to ${data.weekEnd}`,
        html,
      }),
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
