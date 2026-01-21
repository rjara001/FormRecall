
export interface SavedValue {
  id: string;
  value: string;
  timestamp: string;
  usageCount: number;
  isSystem?: boolean;
}

export enum AppTab {
  VAULT = 'vault',
  MONITOR = 'monitor',
  SETTINGS = 'settings'
}

export interface ActivityLog {
  id: string;
  msg: string;
  type: 'intercept' | 'learn' | 'sync' | 'error';
  timestamp: string;
}

// Added missing interface for individual form fields
export interface FormField {
  name: string;
  label: string;
  value: string;
  type: string;
}

// Added missing interface for a complete form entry record
export interface FormEntry {
  id: string;
  pageUrl: string;
  pageTitle: string;
  date: string | number | Date;
  fields: FormField[];
}

// Added missing interface for AI-generated autofill suggestions
export interface AutofillSuggestion {
  fieldName: string;
  suggestedValue: string;
  confidence: number;
  reason: string;
}
