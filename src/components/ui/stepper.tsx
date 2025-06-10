export type Step = {
  label: string;
  isActive: boolean;
  content: React.ReactNode;
  onClick: () => void;
};

type StepperProps = {
  currentStep: number;
  steps: Step[];
};

export const Stepper = (props: StepperProps) => {
  return (
    <div className="grid grid-cols-[300px_1fr] gap-4">
      <div className="flex flex-col gap-2 ">
        {props.steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.isActive ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span className="text-white">{index + 1}</span>
            </div>
            <h2 className="ml-2">{step.label}</h2>
          </div>
        ))}
      </div>
      {props.steps[props.currentStep] && (
        <div>{props.steps[props.currentStep].content}</div>
      )}
    </div>
  );
};
