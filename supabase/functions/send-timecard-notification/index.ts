import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TimeEntry {
  date: string;
  hours: number;
  timeIn: string;
  timeOut: string;
  description: string;
  approved: boolean;
}

interface TimecardNotificationRequest {
  payeeName: string;
  payeeEmail: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  timeEntries: TimeEntry[];
  totalHours: number;
  ratePerHour: number;
  totalPay: number;
  deductions: number;
  expenseReimb: number;
  netPay: number;
  paymentMethod: string;
  paymentDate: string;
  sendToEmail: string;
  notes: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: TimecardNotificationRequest = await req.json();

    const timeEntriesRows = data.timeEntries
      .map(
        (entry) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(entry.date)}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${entry.hours}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${entry.timeIn || '-'}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${entry.timeOut || '-'}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${entry.description || '-'}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${entry.approved ? '✓' : '-'}</td>
        </tr>
      `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
          .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
          .section-title { font-weight: bold; color: #1a365d; margin-bottom: 10px; font-size: 16px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th { background: #1a365d; color: white; padding: 10px; text-align: left; }
          .summary-table td { padding: 8px; border-bottom: 1px solid #eee; }
          .summary-label { font-weight: bold; width: 200px; }
          .total-row { background: #e8f4f8; font-weight: bold; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Independent Contractor Invoice Worksheet</h1>
            <p style="margin: 5px 0 0 0;">Time Report Submission</p>
          </div>

          <div class="section">
            <div class="section-title">PAYEE INFORMATION</div>
            <table class="summary-table">
              <tr>
                <td class="summary-label">Payee Name:</td>
                <td>${data.payeeName}</td>
              </tr>
              <tr>
                <td class="summary-label">Payee Email:</td>
                <td>${data.payeeEmail}</td>
              </tr>
              <tr>
                <td class="summary-label">Pay Period:</td>
                <td>${formatDate(data.payPeriodStart)} - ${formatDate(data.payPeriodEnd)}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">TIME ENTRIES</div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Description</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                ${timeEntriesRows}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">PAYMENT SUMMARY</div>
            <table class="summary-table">
              <tr>
                <td class="summary-label">Total Hours:</td>
                <td>${data.totalHours}</td>
              </tr>
              <tr>
                <td class="summary-label">Rate per Hour:</td>
                <td>${formatCurrency(data.ratePerHour)}</td>
              </tr>
              <tr>
                <td class="summary-label">Total Pay:</td>
                <td>${formatCurrency(data.totalPay)}</td>
              </tr>
              <tr>
                <td class="summary-label">Deductions:</td>
                <td>${formatCurrency(data.deductions)}</td>
              </tr>
              <tr>
                <td class="summary-label">Expense Reimbursement:</td>
                <td>${formatCurrency(data.expenseReimb)}</td>
              </tr>
              <tr class="total-row">
                <td class="summary-label">Net Pay:</td>
                <td>${formatCurrency(data.netPay)}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">PAYMENT DETAILS</div>
            <table class="summary-table">
              <tr>
                <td class="summary-label">Payment Method:</td>
                <td>${data.paymentMethod || 'Not specified'}</td>
              </tr>
              <tr>
                <td class="summary-label">Payment Date:</td>
                <td>${formatDate(data.paymentDate)}</td>
              </tr>
            </table>
          </div>

          ${data.notes ? `
          <div class="section">
            <div class="section-title">NOTES</div>
            <p>${data.notes}</p>
          </div>
          ` : ''}

          <div class="footer">
            <p>This timecard was submitted on ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} (Pacific Time)</p>
            <p>LASO Imaging Services - Internal Time Tracking System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Imaging <updates@updates.lasoimaging.com>",
        to: [data.sendToEmail],
        subject: `Timecard Submission: ${data.payeeName} - ${formatDate(data.payPeriodStart)} to ${formatDate(data.payPeriodEnd)}`,
        html: emailHtml,
      }),
    });

    const emailResponse = await res.json();

    if (!res.ok) {
      throw new Error(emailResponse.message || "Failed to send email");
    }

    console.log("Timecard email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-timecard-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
