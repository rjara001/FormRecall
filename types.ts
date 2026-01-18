
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

export enum AppTab {
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  SIMULATOR = 'simulator',
  SETTINGS = 'settings'
}
