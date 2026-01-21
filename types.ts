
export interface SavedValue {
  id: string;
  value: string;
  category: string;
  timestamp: string;
}

export enum AppTab {
  BROWSER = 'browser', // El simulador actúa como el navegador activo
  VAULT = 'vault',     // Gestión de datos
  SETTINGS = 'settings'
}

// Added FormField interface to match usage in components and services
export interface FormField {
  name: string;
  label: string;
  value: string;
  type: string;
}

// Added FormEntry interface for historical form data tracking
export interface FormEntry {
  id: string;
  pageUrl: string;
  pageTitle: string;
  date: string;
  fields: FormField[];
}

// Added AutofillSuggestion interface for AI-generated response mappings
export interface AutofillSuggestion {
  fieldName: string;
  suggestedValue: string;
  confidence: number;
  reason: string;
}
