import posthog from 'posthog-js';

// ============= Offer Events =============

export const trackOfferCreated = (offerId: string, productName: string, amount: number, customerEmail: string) => {
  posthog.capture('offer_created', {
    offer_id: offerId,
    product_name: productName,
    offer_amount: amount,
    customer_email: customerEmail,
  });
};

export const trackOfferApproved = (offerId: string, productName: string, discountPercent: number) => {
  posthog.capture('offer_approved', {
    offer_id: offerId,
    product_name: productName,
    discount_percent: discountPercent,
  });
};

export const trackOfferRejected = (offerId: string, productName: string, reason?: string) => {
  posthog.capture('offer_rejected', {
    offer_id: offerId,
    product_name: productName,
    rejection_reason: reason,
  });
};

export const trackOfferPurchased = (offerId: string, productName: string, finalAmount: number) => {
  posthog.capture('offer_purchased', {
    offer_id: offerId,
    product_name: productName,
    final_amount: finalAmount,
  });
};

// ============= Lead Events =============

export const trackLeadCreated = (leadId: string, interest: string, sourcePage: string) => {
  posthog.capture('lead_created', {
    lead_id: leadId,
    interest: interest,
    source_page: sourcePage,
  });
};

export const trackLeadTriaged = (leadId: string, newStatus: string, previousStatus?: string) => {
  posthog.capture('lead_triaged', {
    lead_id: leadId,
    new_status: newStatus,
    previous_status: previousStatus,
  });
};

// ============= Quote Events =============

export const trackQuoteSent = (quoteId: string, customerEmail: string, totalAmount: number) => {
  posthog.capture('quote_sent', {
    quote_id: quoteId,
    customer_email: customerEmail,
    total_amount: totalAmount,
  });
};

export const trackQuoteAccepted = (quoteId: string, totalAmount: number) => {
  posthog.capture('quote_accepted', {
    quote_id: quoteId,
    total_amount: totalAmount,
  });
};

export const trackQuoteRejected = (quoteId: string, reason?: string) => {
  posthog.capture('quote_rejected', {
    quote_id: quoteId,
    rejection_reason: reason,
  });
};

// ============= Admin Events =============

export const trackAdminLogin = (userId: string, email: string) => {
  posthog.identify(userId, { email, role: 'admin' });
  posthog.capture('admin_login', {
    user_id: userId,
    email: email,
  });
};

export const trackAdminAction = (action: string, metadata?: Record<string, unknown>) => {
  posthog.capture('admin_action', {
    action,
    ...metadata,
  });
};

// ============= Equipment Events =============

export const trackEquipmentViewed = (productId: string, productName: string, oem: string) => {
  posthog.capture('equipment_viewed', {
    product_id: productId,
    product_name: productName,
    oem: oem,
  });
};

export const trackInventoryAdded = (productId: string, productName: string, modality: string) => {
  posthog.capture('inventory_added', {
    product_id: productId,
    product_name: productName,
    modality: modality,
  });
};

// ============= Trade-In Calculator Events =============

export const trackTradeInCalculation = (data: {
  equipmentType: string;
  manufacturer: string;
  year: string;
  condition: string;
  estimatedLow: number;
  estimatedHigh: number;
}) => {
  posthog.capture('trade_in_calculated', {
    equipment_type: data.equipmentType,
    manufacturer: data.manufacturer,
    year: data.year,
    condition: data.condition,
    estimated_low: data.estimatedLow,
    estimated_high: data.estimatedHigh,
    estimated_midpoint: (data.estimatedLow + data.estimatedHigh) / 2,
  });
};

export const trackTradeInQuoteRequested = (data: {
  equipmentType: string;
  manufacturer: string;
  estimatedValue: number;
}) => {
  posthog.capture('trade_in_quote_requested', {
    equipment_type: data.equipmentType,
    manufacturer: data.manufacturer,
    estimated_value: data.estimatedValue,
  });
};

// ============= User Identification =============

export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  posthog.identify(userId, properties);
};

export const resetUser = () => {
  posthog.reset();
};
