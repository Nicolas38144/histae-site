import { useState } from 'react';

export const demoSteps = ['profile', 'conversation', 'photos'] as const;
type DemoStep = typeof demoSteps[number];

export function useProductDemo() {
  const [step, setStep] = useState<DemoStep>('profile');
  const [mine, setMine] = useState(false);
  const [theirs, setTheirs] = useState(false);
  const advance = () => {
    if (step === 'profile') setStep('conversation');
    else if (step === 'conversation') setStep('photos');
    else {
      setStep('profile');
      setMine(false);
      setTheirs(false);
    }
  };
  return { step, setStep, mine, setMine, theirs, setTheirs, advance };
}
