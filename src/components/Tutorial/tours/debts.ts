import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';

export const debtsSteps: DriveStep[] = [
  {
    element: '[data-tour="debt-overview"]',
    popover: {
      title: '[ 01 ] DEBT_OVERVIEW',
      description: 'See total debt balance and payment progress.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="add-debt-btn"]',
    popover: {
      title: '[ 02 ] ADD_DEBT',
      description: 'Track loans, credit cards, or other debts.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="debt-list"]',
    popover: {
      title: '[ 03 ] DEBT_LIST',
      description: 'View all your debts with remaining balances.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="payment-schedule"]',
    popover: {
      title: '[ 04 ] PAYMENT_SCHEDULE',
      description: 'See upcoming payment due dates and amounts.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="debt-payoff-plan"]',
    popover: {
      title: '[ 05 ] PAYOFF_STRATEGY',
      description: 'View your debt payoff timeline and progress.',
      side: 'top',
    },
  },
];

export const debtsTour = {
  id: 'debts',
  steps: debtsSteps,
  driver: () =>
    driver({
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 16,
      steps: debtsSteps,
    }),
};
