import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';

export const investmentsSteps: DriveStep[] = [
  {
    element: '[data-tour="investment-summary"]',
    popover: {
      title: '[ 01 ] INVESTMENT_SUMMARY',
      description: 'See total portfolio value and overall returns.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="add-investment-btn"]',
    popover: {
      title: '[ 02 ] ADD_INVESTMENT',
      description: 'Track stocks, crypto, or other investment assets.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="portfolio-list"]',
    popover: {
      title: '[ 03 ] PORTFOLIO_LIST',
      description: 'View all your investment holdings in one place.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="performance-stats"]',
    popover: {
      title: '[ 04 ] PERFORMANCE_TRACKING',
      description: 'Monitor gains, losses, and ROI for each investment.',
      side: 'top',
    },
  },
];

export const investmentsTour = {
  id: 'investments',
  steps: investmentsSteps,
  driver: () =>
    driver({
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 16,
      steps: investmentsSteps,
    }),
};
