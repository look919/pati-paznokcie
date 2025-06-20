"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
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
import {
  AvailableDates,
  findTreatmentDateAction,
} from "@/actions/submission/findTreatmentDateAction";
import { SubmissionFormSuccess } from "./SubmissionFormSuccess";

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
      phone: "+48 ",
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
      }, 200);
    } catch {
      toast.error("Wystąpił błąd podczas wysyłania formularza");
    }
  };

  return (
    <div className="bg-white/90 rounded-lg shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 border-6 border-slate-300">
        <div className="p-8 md:p-12 bg-white min-h-[600px] lg:min-h-[650px]">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Umów wizytę
          </h3>
          <SubmissionFormBasicData
            form={form}
            treatments={treatments}
            onSubmit={handleSubmitBasicForm}
            submissionFormState={submissionFormState}
            setSubmissionFormState={setSubmissionFormState}
          />
        </div>

        <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-8 md:p-12 text-white min-h-[600px] lg:min-h-[650px] flex flex-col">
          <h3 className="text-2xl font-semibold mb-8">
            {submissionFormState === "CHOOSE_DATE"
              ? "Dostępne terminy"
              : submissionFormState === "SUCCESS"
              ? "Rezerwacja potwierdzona"
              : "Wybierz usługi"}
          </h3>

          {submissionFormState === "SUCCESS" ? (
            <div className="h-full flex-grow">
              <SubmissionFormSuccess />
            </div>
          ) : submissionFormState === "CHOOSE_DATE" ? (
            <div className="text-white h-full flex-grow flex flex-col">
              <SubmissionFormChooseDate
                availableDates={availableDates}
                basicForm={form}
                setSubmissionFormState={setSubmissionFormState}
              />
            </div>
          ) : (
            <div className="space-y-6 flex-grow h-full flex flex-col justify-center">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-lg">Krok 1</span>
                  <p className="mt-1 text-green-100">
                    Wypełnij swoje dane i wybierz usługi, które Cię interesują.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                    <path
                      fillRule="evenodd"
                      d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-lg">Krok 2</span>
                  <p className="mt-1 text-green-100">
                    Wybierz dogodny dla siebie termin.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.738a.75.75 0 0 1 1.04-.209Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-lg">Krok 3</span>
                  <p className="mt-1 text-green-100">
                    Twoja rezerwacja zostanie potwierdzona, a my skontaktujemy
                    się z Tobą w celu ustalenia szczegółów.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
