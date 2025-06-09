import { Input } from "./input";
import { Label } from "./label";

interface FormInputProps {
  labelProps?: React.ComponentProps<"label">;
  inputProps?: React.ComponentProps<"input">;
}

export const FormInput = ({ labelProps, inputProps }: FormInputProps) => {
  return (
    <div>
      <Label
        {...labelProps}
        className="text-lg font-semibold"
        htmlFor={inputProps?.id}
      >
        {labelProps?.children || inputProps?.name}
      </Label>
      <Input type="text" {...inputProps} />
    </div>
  );
};
