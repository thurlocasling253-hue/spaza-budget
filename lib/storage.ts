export type BudgetEntry = {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
};

export const STORAGE_KEY = 'spaza_budget_entries';

export function getEntries(): BudgetEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: BudgetEntry[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}
