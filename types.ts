
export interface SavedValue {
  id: string;
  value: string;
  timestamp: string;
  usageCount: number;
}

export enum AppTab {
  VAULT = 'vault',
  CAPTURE_DEMO = 'capture_demo',
  SETTINGS = 'settings'
}

// Added FormField interface to define the structure of form inputs
export interface FormField {
  name: string;
  label: string;
  value: string;
  type: string;
}

// Added FormEntry interface to track historical form submissions
export interface FormEntry {
  id: string;
  pageUrl: string;
  pageTitle: string;
  date: string;
  fields: FormField[];
}

// Added AutofillSuggestion interface for Gemini AI recommendations
export interface AutofillSuggestion {
  fieldName: string;
  suggestedValue: string;
  confidence: number;
  reason: string;
}
