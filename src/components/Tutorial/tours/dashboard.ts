import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';

export const dashboardSteps: DriveStep[] = [
  {
    element: '[data-tour="summary-cards"]',
    popover: {
      title: '[ 01 ] SUMMARY_OVERVIEW',
      description: 'View your financial snapshot - payroll, income, expenses, and net flow at a glance.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="recent-transactions"]',
    popover: {
      title: '[ 02 ] RECENT_TRANSACTIONS',
      description: 'See your latest transactions and track spending patterns over time.',
      side: 'top',
    },
  },
];

export const dashboardTour = {
  id: 'dashboard',
  steps: dashboardSteps,
  driver: () =>
    driver({
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 16,
      steps: dashboardSteps,
    }),
};
