import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  type: 'lead' | 'quote' | 'customer' | 'sell_request';
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

export function useGlobalSearch(searchTerm: string) {
  return useQuery({
    queryKey: ["global-search", searchTerm],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const results: SearchResult[] = [];
      const term = searchTerm.toLowerCase();
      
      // Search leads
      const { data: leads } = await supabase
        .from("leads")
        .select("id, name, email, company, interest")
        .or(`name.ilike.%${term}%,email.ilike.%${term}%,company.ilike.%${term}%`)
        .limit(5);
      
      if (leads) {
        leads.forEach(lead => {
          results.push({
            type: 'lead',
            id: lead.id,
            title: lead.name,
            subtitle: lead.company || lead.email,
            url: `/admin/notifications?lead=${lead.id}`,
          });
        });
      }
      
      // Search quotes
      const { data: quotes } = await supabase
        .from("quotes")
        .select("id, quote_number, customer_name, customer_company, total_amount")
        .or(`quote_number.ilike.%${term}%,customer_name.ilike.%${term}%,customer_company.ilike.%${term}%`)
        .limit(5);
      
      if (quotes) {
        quotes.forEach(quote => {
          results.push({
            type: 'quote',
            id: quote.id,
            title: quote.quote_number,
            subtitle: `${quote.customer_name} - $${quote.total_amount?.toLocaleString() || 0}`,
            url: `/admin/quotes?id=${quote.id}`,
          });
        });
      }
      
      // Search customers
      const { data: customers } = await supabase
        .from("customers")
        .select("id, name, email, company")
        .or(`name.ilike.%${term}%,email.ilike.%${term}%,company.ilike.%${term}%`)
        .limit(5);
      
      if (customers) {
        customers.forEach(customer => {
          results.push({
            type: 'customer',
            id: customer.id,
            title: customer.name,
            subtitle: customer.company || customer.email,
            url: `/admin/customers?id=${customer.id}`,
          });
        });
      }
      
      // Search sell requests (MRI/CT Manage)
      const { data: sellRequests } = await supabase
        .from("equipment_sell_requests")
        .select("id, name, company, model, manufacturer, equipment_type, deal_priority")
        .or(`name.ilike.%${term}%,company.ilike.%${term}%,model.ilike.%${term}%,manufacturer.ilike.%${term}%,city.ilike.%${term}%`)
        .limit(5);
      
      if (sellRequests) {
        sellRequests.forEach(req => {
          results.push({
            type: 'sell_request',
            id: req.id,
            title: req.company || req.name,
            subtitle: `${req.manufacturer || ''} ${req.model || req.equipment_type}`.trim(),
            url: `/admin/sell-requests?id=${req.id}`,
          });
        });
      }
      
      return results;
    },
    enabled: searchTerm.length >= 2,
    staleTime: 1000 * 30, // 30 seconds
  });
}
