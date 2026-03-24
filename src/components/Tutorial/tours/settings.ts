import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';

export const settingsSteps: DriveStep[] = [
  {
    element: '[data-tour="currency-settings"]',
    popover: {
      title: '[ 01 ] LANGUAGE',
      description: 'Choose your preferred language for the interface.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="account-settings"]',
    popover: {
      title: '[ 02 ] CHANGE_PIN',
      description: 'Manage your PIN and account security.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="data-management"]',
    popover: {
      title: '[ 03 ] DATA_MANAGEMENT',
      description: 'Import or export your financial data for backup.',
      side: 'top',
    },
  },
];

export const settingsTour = {
  id: 'settings',
  steps: settingsSteps,
  driver: () =>
    driver({
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 16,
      steps: settingsSteps,
    }),
};
