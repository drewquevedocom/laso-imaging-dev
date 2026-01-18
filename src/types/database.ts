// TypeScript interfaces for database tables

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  interest: string;
  message?: string;
  source_page: string;
  lead_score: number;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'New' | 'Attempted' | 'Quoted' | 'Contract Sent' | 'Closed Won' | 'Closed Lost';
  urgency: 'Normal' | 'High' | 'Emergency';
  lead_type: 'Sale' | 'Service' | 'Mobile Rental';
  is_hot: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  product_name: string;
  oem: 'GE' | 'Siemens' | 'Philips' | 'Toshiba/Canon' | 'Hitachi' | 'Other' | string;
  modality: 'MRI' | 'CT' | 'X-Ray' | 'PET/CT' | 'Ultrasound' | 'Other' | string;
  serial_number?: string;
  availability_status: 'Available' | 'Sold' | 'Reserved' | 'In Transit' | 'Under Repair' | 'Rented';
  price?: number;
  description?: string;
  location?: string;
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Refurbished';
  year_manufactured?: number;
  software_version?: string;
  magnet_type?: string;
  images: string[];
  notes?: string;
  // Rental-specific fields
  is_rental?: boolean;
  rental_daily_rate?: number;
  rental_weekly_rate?: number;
  rental_monthly_rate?: number;
  warehouse_location?: string;
  next_available_date?: string;
  // Sales tracking fields
  open_quotes_count?: number;
  open_offers_count?: number;
  total_quotes_count?: number;
  total_offers_count?: number;
  conversion_rate?: number;
  avg_discount_percentage?: number;
  last_quote_at?: string;
  last_offer_at?: string;
  sales_strategy?: 'all' | 'list_only' | 'quote_only' | 'offer_enabled';
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  lead_id?: string;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  customer_phone?: string;
  items: QuoteLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';
  valid_until?: string;
  notes?: string;
  internal_notes?: string;
  pdf_url?: string;
  sent_at?: string;
  viewed_at?: string;
  responded_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Activity {
  id: string;
  lead_id: string;
  activity_type: 'Email' | 'Call' | 'SMS' | 'Note' | 'Meeting' | 'Quote Sent';
  content: string;
  metadata: Record<string, unknown>;
  direction?: 'outbound' | 'inbound';
  subject?: string;
  created_by?: string;
  created_at: string;
}

export interface QuoteTemplate {
  id: string;
  name: string;
  description: string | null;
  items: QuoteTemplateItem[];
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteTemplateItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface EquipmentRental {
  id: string;
  inventory_id?: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  customer_phone?: string;
  start_date: string;
  end_date: string;
  pickup_date?: string;
  return_date?: string;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  total_amount?: number;
  deposit_amount?: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  delivery_address?: string;
  delivery_notes?: string;
  pickup_reminder_sent?: boolean;
  return_reminder_sent?: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  inventory?: InventoryItem;
}
