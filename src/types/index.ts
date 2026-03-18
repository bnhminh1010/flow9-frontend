export interface User {
  _id: string;
  pin: string;
  name: string;
  settings: {
    currency: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkShift {
  _id: string;
  userId: string;
  date: string;
  hours: number;
  shiftType: 'day' | 'night' | 'holiday';
  hourlyRate: number;
  dailySalary: number;
  isHoliday: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryConfig {
  _id: string;
  userId: string;
  baseHourlyRate: number;
  dayShiftMultiplier: number;
  nightShiftMultiplier: number;
  holidayMultiplier: number;
  overtimeMultiplier: number;
  allowances: Array<{ name: string; amount: number }>;
  updatedAt: string;
}

export interface MonthlySummary {
  totalSalary: number;
  totalHours: number;
  totalShifts: number;
  byShiftType: {
    day: number;
    night: number;
    holiday: number;
  };
}

export interface Subscription {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  currency: 'VND' | 'USD';
  billingCycle: 'weekly' | 'monthly' | 'yearly';
  nextBillingDate: string;
  category: string;
  isActive: boolean;
  reminderDays: number;
  notified: boolean;
  lastNotifiedAt?: string;
  paymentMethod?: string;
  notes?: string;
  paymentHistory: Array<{
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    notes?: string;
    transactionId?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  categoryId?: string;
  description: string;
  date: string;
  tags?: string[];
  attachments?: string[];
  isRecurring: boolean;
  recurringConfig?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
    nextRunDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface AggregateByCategory {
  _id: string;
  total: number;
  count: number;
}

export interface AggregateByMonth {
  _id: { year: number; month: number };
  income: number;
  expense: number;
}

export interface AggregateLast7Days {
  _id: string;
  income: number;
  expense: number;
}

export interface AggregateResponse {
  byCategory: AggregateByCategory[];
  byMonth: AggregateByMonth[];
  last7Days: AggregateLast7Days[];
}

export interface UpcomingSubscription {
  _id: string;
  name: string;
  amount: number;
  currency: string;
  nextBillingDate: string;
  daysUntil: number;
}
