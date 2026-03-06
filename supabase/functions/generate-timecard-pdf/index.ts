import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TimecardPDFRequest {
  staffName: string;
  staffEmail: string;
  weekStart: string;
  weekEnd: string;
  entries: {
    date: string;
    clockIn: string;
    clockOut: string;
    breakMinutes: number;
    hours: string;
    notes: string;
    tag: string;
  }[];
  totalHours: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: TimecardPDFRequest = await req.json();

    // Generate a simple HTML-based PDF-like content that can be converted
    // We'll return structured HTML that the email function can use as attachment
    const rows = data.entries
      .map(
        (e) => `
        <tr>
          <td style="border:1px solid #ccc;padding:6px 8px;">${e.date}</td>
          <td style="border:1px solid #ccc;padding:6px 8px;text-align:center;">${e.tag && e.tag !== 'clock' ? e.tag.toUpperCase() : e.clockIn}</td>
          <td style="border:1px solid #ccc;padding:6px 8px;text-align:center;">${e.tag && e.tag !== 'clock' ? '—' : e.clockOut}</td>
          <td style="border:1px solid #ccc;padding:6px 8px;text-align:center;">${e.breakMinutes > 0 ? e.breakMinutes + 'min' : '—'}</td>
          <td style="border:1px solid #ccc;padding:6px 8px;text-align:right;">${e.hours}h</td>
          <td style="border:1px solid #ccc;padding:6px 8px;">${e.notes || '—'}</td>
        </tr>`
      )
      .join("");

    const pdfHtml = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; color: #333; margin: 40px; }
  .logo { font-size: 24px; font-weight: bold; color: #1a365d; margin-bottom: 4px; }
  .subtitle { color: #666; font-size: 12px; margin-bottom: 24px; }
  h2 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  th { background: #1a365d; color: #fff; padding: 8px; text-align: left; }
  .total-row { background: #e8f4f8; font-weight: bold; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
  .overtime { color: #d97706; font-weight: bold; }
</style>
</head>
<body>
  <div class="logo">LASO Imaging Solutions</div>
  <div class="subtitle">Staff Timecard Report</div>
  
  <h2>Timecard — ${data.staffName}</h2>
  <p><strong>Week:</strong> ${data.weekStart} – ${data.weekEnd}</p>
  <p><strong>Email:</strong> ${data.staffEmail}</p>
  
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Clock In</th>
        <th>Clock Out</th>
        <th>Break</th>
        <th>Hours</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="total-row">
        <td style="border:1px solid #ccc;padding:6px 8px;" colspan="4"><strong>Total Hours</strong></td>
        <td style="border:1px solid #ccc;padding:6px 8px;text-align:right;"><strong>${data.totalHours}h</strong></td>
        <td style="border:1px solid #ccc;padding:6px 8px;"></td>
      </tr>
    </tbody>
  </table>
  
  ${parseFloat(data.totalHours) > 40 ? '<p class="overtime">⚠️ Overtime: Total hours exceed 40 for this week.</p>' : ''}
  
  <div class="footer">
    <p>Generated on ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} (Pacific Time)</p>
    <p>LASO Imaging Solutions — Internal Staff Timecard System</p>
  </div>
</body>
</html>`;

    // Convert to base64 for email attachment
    const encoder = new TextEncoder();
    const pdfBase64 = btoa(String.fromCharCode(...encoder.encode(pdfHtml)));

    return new Response(JSON.stringify({ html: pdfHtml, base64: pdfBase64 }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("generate-timecard-pdf error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
