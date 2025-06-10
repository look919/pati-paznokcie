"use client";

import { Step, Stepper } from "@/components/ui/stepper";
import { useState } from "react";
import { SubmissionStepperChooseTreatment } from "./SubmissionStepperChooseTreatment";

type SubmissionStepperProps = {
  treatments: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
};
export const SubmissionStepper = (props: SubmissionStepperProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      label: "Wybierz zabieg",
      content: (
        <SubmissionStepperChooseTreatment
          treatments={props.treatments}
          goToTheNextStep={() => setCurrentStep(1)}
        />
      ),
      isActive: currentStep === 0,
      onClick: () => setCurrentStep(0),
    },
    {
      label: "Wybierz datę i godzinę zabiegu",
      content: <div>Content for Step 2</div>,
      isActive: currentStep === 1,
      onClick: () => setCurrentStep(1),
    },
    {
      label: "Podaj niezbędne dane",
      content: <div>Content for Step 3</div>,
      isActive: currentStep === 2,
      onClick: () => setCurrentStep(2),
    },
    {
      label: "Podsumowanie",
      content: <div>Content for Step 4</div>,
      isActive: currentStep === 3,
      onClick: () => setCurrentStep(3),
    },
  ];

  return <Stepper currentStep={currentStep} steps={steps} />;
};
