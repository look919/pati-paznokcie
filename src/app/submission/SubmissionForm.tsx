"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { FormInput } from "@/components/ui/formInput";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const SubmissionForm = () => {
  const isSubmitting = false;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <form method="post" className="flex flex-col gap-4">
      <FormInput
        labelProps={{ children: "Name" }}
        inputProps={{ id: "name", name: "name" }}
      />
      <FormInput
        labelProps={{ children: "Surname" }}
        inputProps={{ id: "surname", name: "surname" }}
      />
      <FormInput
        labelProps={{ children: "Email" }}
        inputProps={{ id: "email", name: "email", type: "email" }}
      />
      <FormInput
        labelProps={{ children: "Phone number" }}
        inputProps={{ id: "phone", name: "phone", type: "tel" }}
      />
      <DatePicker
        labelProps={{ children: "Select date" }}
        id="date"
        onDateChange={(value) => setDate(value?.toISOString() || "")}
      />
      <input type="hidden" name="date" value={date} />
      <div>
        <Label htmlFor="time" className="text-lg font-semibold">
          Pick a time
        </Label>
        <Select onValueChange={(value) => setTime(value)}>
          <SelectTrigger id="time" className="w-full">
            <SelectValue placeholder="Pick a time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pick a time</SelectLabel>
              <SelectItem value="10:00">10:00</SelectItem>
              <SelectItem value="11:00">11:00</SelectItem>
              <SelectItem value="12:00">12:00</SelectItem>
              <SelectItem value="13:00">13:00</SelectItem>
              <SelectItem value="14:00">14:00</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <input type="hidden" name="time" value={time} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};
