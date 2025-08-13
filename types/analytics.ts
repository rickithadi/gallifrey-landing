// Google Analytics types
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface GAPageView {
  page_title?: string;
  page_location?: string;
  page_path?: string;
}

export interface GAConfig {
  page_path?: string;
  page_title?: string;
  page_location?: string;
  custom_map?: Record<string, string>;
  send_page_view?: boolean;
}

// Common event categories
export enum EventCategory {
  CONTACT = "contact",
  PRICING = "pricing",
  CTA = "cta",
  NAVIGATION = "navigation",
  ENGAGEMENT = "engagement",
  DOWNLOAD = "download",
  SOCIAL = "social",
}

// Common event actions
export enum EventAction {
  CLICK = "click",
  SUBMIT = "submit",
  NAVIGATE = "navigate",
  SCROLL = "scroll",
  DOWNLOAD = "download",
  SHARE = "share",
  VIEW = "view",
}
