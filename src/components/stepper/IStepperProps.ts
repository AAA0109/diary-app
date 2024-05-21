import { FC } from 'react';

export interface IStepperProps {
    steps: Array<String>;
    currentStep: number;
    Icon: FC;
    currentProgress: number;
    setStep: (step: number) => void;
}
