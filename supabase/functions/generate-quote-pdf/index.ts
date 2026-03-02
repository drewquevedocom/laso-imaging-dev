import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  customer_phone?: string;
  line_items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  valid_until?: string;
  created_at: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const generatePdfHtml = (quote: Quote): string => {
  const lineItemsHtml = (quote.line_items || [])
    .map(
      (item: LineItem) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unit_price)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.total)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #1f2937;
          line-height: 1.5;
          margin: 0;
          padding: 40px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #1e40af;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1e40af;
        }
        .logo span {
          color: #60a5fa;
        }
        .quote-info {
          text-align: right;
        }
        .quote-number {
          font-size: 24px;
          font-weight: bold;
          color: #1e40af;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .customer-info {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
        }
        .customer-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background: #1e40af;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        th:nth-child(2), th:nth-child(3), th:nth-child(4) {
          text-align: center;
        }
        th:last-child {
          text-align: right;
        }
        .totals {
          margin-left: auto;
          width: 300px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .totals-row.total {
          font-size: 20px;
          font-weight: bold;
          color: #1e40af;
          border-bottom: 2px solid #1e40af;
          padding-top: 12px;
        }
        .notes {
          background: #fef3c7;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        .validity {
          background: #dbeafe;
          padding: 12px 20px;
          border-radius: 8px;
          display: inline-block;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">LASO <span>Imaging Solutions</span></div>
          <div style="color: #6b7280; margin-top: 4px;">Medical Imaging Equipment & Services</div>
        </div>
        <div class="quote-info">
          <div class="quote-number">${quote.quote_number}</div>
          <div style="color: #6b7280;">Date: ${formatDate(quote.created_at)}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Bill To</div>
        <div class="customer-info">
          <div class="customer-name">${quote.customer_name}</div>
          ${quote.customer_company ? `<div>${quote.customer_company}</div>` : ""}
          <div>${quote.customer_email}</div>
          ${quote.customer_phone ? `<div>${quote.customer_phone}</div>` : ""}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Quote Details</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>${formatCurrency(quote.subtotal)}</span>
          </div>
          <div class="totals-row">
            <span>Tax</span>
            <span>${formatCurrency(quote.tax)}</span>
          </div>
          <div class="totals-row total">
            <span>Total</span>
            <span>${formatCurrency(quote.total)}</span>
          </div>
        </div>
      </div>

      ${
        quote.notes
          ? `
        <div class="section">
          <div class="section-title">Notes</div>
          <div class="notes">${quote.notes}</div>
        </div>
      `
          : ""
      }

      <div class="validity">
        <strong>Valid Until:</strong> ${quote.valid_until ? formatDate(quote.valid_until) : "30 days from quote date"}
      </div>

      <div class="footer">
        <p>LASO Imaging Solutions | info@lasoimaging.com | (844) 511-5276</p>
        <p>Mailing Address: 14900 Magnolia Blvd #56323, Sherman Oaks, CA 91413</p>
        <p>Thank you for your business!</p>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId } = await req.json();

    if (!quoteId) {
      return new Response(
        JSON.stringify({ error: "Quote ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the quote
    const { data: quote, error: fetchError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .single();

    if (fetchError || !quote) {
      console.error("Error fetching quote:", fetchError);
      return new Response(
        JSON.stringify({ error: "Quote not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate PDF HTML
    const pdfHtml = generatePdfHtml(quote as Quote);

    console.log("PDF HTML generated successfully for quote:", quote.quote_number);

    // Return the HTML that can be used to generate PDF client-side
    // In a production environment, you would use a PDF generation service
    return new Response(
      JSON.stringify({
        success: true,
        html: pdfHtml,
        quote: {
          id: quote.id,
          quote_number: quote.quote_number,
          customer_name: quote.customer_name,
          total: quote.total,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-quote-pdf function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
