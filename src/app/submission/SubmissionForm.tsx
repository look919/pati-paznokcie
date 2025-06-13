"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SubmissionFormBasicData,
  SubmissionFormBasicDataSchema,
  submissionFormBasicDataSchema,
} from "./SubmissionFormBasicData";
import {
  SubmissionFormChooseDate,
  SubmissionFormChooseDateSchema,
} from "./SubmissionFormChooseDate";
import { useState } from "react";
import {
  AvailableDates,
  findTreatmentDateAction,
} from "../../actions/findTreatmentDateAction";
import { toast } from "sonner";

type SubmissionFormProps = {
  treatments: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
};

export type SubmissionFullSchema = SubmissionFormBasicDataSchema &
  SubmissionFormChooseDateSchema;

export type SubmissionFormState =
  | "FILLING_BASIC_DATA"
  | "PENDING_FILLING_BASIC_DATA"
  | "CHOOSE_DATE"
  | "PENDING_CHOOSE_DATE"
  | "SUCCESS";

export const SubmissionForm = ({ treatments }: SubmissionFormProps) => {
  const [submissionFormState, setSubmissionFormState] =
    useState<SubmissionFormState>("FILLING_BASIC_DATA");
  const form = useForm<SubmissionFormBasicDataSchema>({
    resolver: zodResolver(submissionFormBasicDataSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      treatments: [],
      duration: 0,
    },
  });
  const [availableDates, setAvailableDates] = useState<AvailableDates>({
    allDates: [],
    preferableDates: [],
  });

  const handleSubmitBasicForm = async (data: SubmissionFormBasicDataSchema) => {
    try {
      setSubmissionFormState("PENDING_FILLING_BASIC_DATA");
      const availableDates = await findTreatmentDateAction(data.duration);
      setTimeout(() => {
        setAvailableDates(availableDates);
        setSubmissionFormState("CHOOSE_DATE");
      }, 1200);
    } catch {
      toast.error("Wystąpił błąd podczas wysyłania formularza");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <SubmissionFormBasicData
        form={form}
        treatments={treatments}
        onSubmit={handleSubmitBasicForm}
        submissionFormState={submissionFormState}
        setSubmissionFormState={setSubmissionFormState}
      />
      {submissionFormState === "CHOOSE_DATE" && (
        <SubmissionFormChooseDate
          availableDates={availableDates}
          basicData={form.getValues()}
        />
      )}
    </div>
  );
};
