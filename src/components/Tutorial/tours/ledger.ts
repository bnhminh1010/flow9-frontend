import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';

export const ledgerSteps: DriveStep[] = [
  {
    element: '[data-tour="ledger-filters"]',
    popover: {
      title: '[ 01 ] FILTER_TRANSACTIONS',
      description: 'Filter transactions by date range, category, or type.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="ledger-search"]',
    popover: {
      title: '[ 02 ] SEARCH',
      description: 'Search for specific transactions by description.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="add-transaction-btn"]',
    popover: {
      title: '[ 03 ] ADD_TRANSACTION',
      description: 'Quickly add new income or expense transactions.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="ledger-table"]',
    popover: {
      title: '[ 04 ] TRANSACTION_LIST',
      description: 'View all your transactions in chronological order.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="category-stats"]',
    popover: {
      title: '[ 05 ] CATEGORY_BREAKDOWN',
      description: 'See spending breakdown by category.',
      side: 'left',
    },
  },
];

export const ledgerTour = {
  id: 'ledger',
  steps: ledgerSteps,
  driver: () =>
    driver({
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 16,
      steps: ledgerSteps,
    }),
};
