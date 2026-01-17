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
  availability_status: 'Available' | 'Sold' | 'Reserved' | 'In Transit' | 'Under Repair';
  price?: number;
  description?: string;
  location?: string;
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Refurbished';
  year_manufactured?: number;
  software_version?: string;
  magnet_type?: string;
  images: string[];
  notes?: string;
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
  created_by?: string;
  created_at: string;
}
