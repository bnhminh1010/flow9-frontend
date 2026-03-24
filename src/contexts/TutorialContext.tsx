'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { driver as createDriver } from 'driver.js';
import { allSteps } from '@/components/Tutorial/tours';
import type { Driver } from 'driver.js';

interface TutorialContextType {
  isTourOpen: boolean;
  tourName: string | null;
  startTour: (name: string) => void;
  endTour: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
}

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourName, setTourName] = useState<string | null>(null);
  const driverRef = useRef<Driver | null>(null);

  const startTour = useCallback((name: string) => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    
    const steps = allSteps[name];
    if (steps) {
      const d = createDriver({
        animate: true,
        allowClose: true,
        overlayColor: 'rgba(0, 0, 0, 0.75)',
        overlayOpacity: 0.8,
        smoothScroll: true,
        stagePadding: 24,
        stageRadius: 4,
        showButtons: ['previous', 'next', 'close'],
        showProgress: true,
        nextBtnText: 'NEXT',
        prevBtnText: 'PREV',
        doneBtnText: 'DONE',
        progressText: '{{current}} / {{total}}',
        onDestroyed: () => {
          setIsTourOpen(false);
          setTourName(null);
        },
      });
      d.setSteps(steps);
      driverRef.current = d;
      d.drive();
      setTourName(name);
      setIsTourOpen(true);
    }
  }, []);

  const endTour = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
    setIsTourOpen(false);
    setTourName(null);
  }, []);

  return (
    <TutorialContext.Provider value={{ isTourOpen, tourName, startTour, endTour }}>
      {children}
    </TutorialContext.Provider>
  );
}
