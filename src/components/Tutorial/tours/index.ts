export { dashboardTour, dashboardSteps } from './dashboard';
export { ledgerTour, ledgerSteps } from './ledger';
export { budgetsTour, budgetsSteps } from './budgets';
export { subscriptionsTour, subscriptionsSteps } from './subscriptions';
export { payrollTour, payrollSteps } from './payroll';
export { investmentsTour, investmentsSteps } from './investments';
export { debtsTour, debtsSteps } from './debts';
export { settingsTour, settingsSteps } from './settings';

import { dashboardTour, dashboardSteps } from './dashboard';
import { ledgerTour, ledgerSteps } from './ledger';
import { budgetsTour, budgetsSteps } from './budgets';
import { subscriptionsTour, subscriptionsSteps } from './subscriptions';
import { payrollTour, payrollSteps } from './payroll';
import { investmentsTour, investmentsSteps } from './investments';
import { debtsTour, debtsSteps } from './debts';
import { settingsTour, settingsSteps } from './settings';
import type { DriveStep } from 'driver.js';

export const allSteps: Record<string, DriveStep[]> = {
  dashboard: dashboardSteps,
  ledger: ledgerSteps,
  budgets: budgetsSteps,
  subscriptions: subscriptionsSteps,
  payroll: payrollSteps,
  investments: investmentsSteps,
  debts: debtsSteps,
  settings: settingsSteps,
};

export const allTours = {
  dashboard: dashboardTour,
  ledger: ledgerTour,
  budgets: budgetsTour,
  subscriptions: subscriptionsTour,
  payroll: payrollTour,
  investments: investmentsTour,
  debts: debtsTour,
  settings: settingsTour,
};

export type TourId = keyof typeof allTours;
