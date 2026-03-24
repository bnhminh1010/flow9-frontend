import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';

export const payrollSteps: DriveStep[] = [
  {
    element: '[data-tour="payroll-overview"]',
    popover: {
      title: '[ 01 ] PAYROLL_OVERVIEW',
      description: 'See your income breakdown and net pay summary.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="add-income-btn"]',
    popover: {
      title: '[ 02 ] ADD_SHIFT',
      description: 'Record salary, bonuses, or other income sources.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="income-list"]',
    popover: {
      title: '[ 03 ] SHIFT_MATRIX',
      description: 'View all your recorded income entries over time.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="deductions"]',
    popover: {
      title: '[ 04 ] WAGE_CONFIG',
      description: 'Configure base hourly rate and shift multipliers.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="income-stats"]',
    popover: {
      title: '[ 05 ] INCOME_STATS',
      description: 'Analyze your income trends and patterns.',
      side: 'left',
    },
  },
];

export const payrollTour = {
  id: 'payroll',
  steps: payrollSteps,
  driver: () =>
    driver({
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 16,
      steps: payrollSteps,
    }),
};
