import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';

export const budgetsSteps: DriveStep[] = [
  {
    element: '[data-tour="budget-overview"]',
    popover: {
      title: '[ 01 ] BUDGET_OVERVIEW',
      description: 'See your total budget allocation and remaining amounts.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="add-budget-btn"]',
    popover: {
      title: '[ 02 ] CREATE_BUDGET',
      description: 'Set up a new budget category with spending limits.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="budget-categories"]',
    popover: {
      title: '[ 03 ] BUDGET_CATEGORIES',
      description: 'Manage your budget categories and track spending against limits.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="budget-progress"]',
    popover: {
      title: '[ 04 ] PROGRESS_TRACKING',
      description: 'Track how much you have spent vs your budget limit.',
      side: 'top',
    },
  },
];

export const budgetsTour = {
  id: 'budgets',
  steps: budgetsSteps,
  driver: () =>
    driver({
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 16,
      steps: budgetsSteps,
    }),
};
