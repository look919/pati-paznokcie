import { FindTreatmentDateActionReturnType } from "./findTreatmentDateAction";

type SubmissionStepperChooseDateProps = {
  goToTheNextStep: () => void;
  goBackToPreviousStep: () => void;
};

export const SubmissionStepperChooseDate = (
  props: SubmissionStepperChooseDateProps
) => {
  const availableDates: FindTreatmentDateActionReturnType = JSON.parse(
    sessionStorage.getItem("submission-available-dates") ||
      "{ preferableDates: [], allDates: [] }"
  );
  return <></>;
};
