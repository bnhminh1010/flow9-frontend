import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';

export const subscriptionsSteps: DriveStep[] = [
  {
    element: '[data-tour="subscription-summary"]',
    popover: {
      title: '[ 01 ] SUBSCRIPTION_SUMMARY',
      description: 'See total monthly/yearly subscription costs at a glance.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="add-subscription-btn"]',
    popover: {
      title: '[ 02 ] ADD_SUBSCRIPTION',
      description: 'Track a new subscription service with billing details.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="subscription-list"]',
    popover: {
      title: '[ 03 ] SUBSCRIPTION_LIST',
      description: 'List of all your active subscriptions with upcoming renewals.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="upcoming-payments"]',
    popover: {
      title: '[ 04 ] UPCOMING_PAYMENTS',
      description: 'See which subscriptions are due for renewal soon.',
      side: 'left',
    },
  },
];

export const subscriptionsTour = {
  id: 'subscriptions',
  steps: subscriptionsSteps,
  driver: () =>
    driver({
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 16,
      steps: subscriptionsSteps,
    }),
};
