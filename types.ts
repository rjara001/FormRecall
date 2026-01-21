
export interface SavedValue {
  id: string;
  value: string;
  timestamp: string;
  usageCount: number;
  isSystem?: boolean; // Para identificar entradas de prueba/sistema
}

export enum AppTab {
  VAULT = 'vault',
  CAPTURE_DEMO = 'capture_demo',
  SETTINGS = 'settings'
}

export interface FormField {
  name: string;
  label: string;
  value: string;
  type: string;
}

export interface FormEntry {
  id: string;
  pageUrl: string;
  pageTitle: string;
  date: string;
  fields: FormField[];
}

export interface AutofillSuggestion {
  fieldName: string;
  suggestedValue: string;
  confidence: number;
  reason: string;
}
