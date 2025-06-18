type LoadingSpinnerProps = {
  size?: "small" | "medium" | "large";
  color?: "blue" | "white";
  text?: string;
};

export const LoadingSpinner = ({
  size = "medium",
  color = "blue",
  text,
}: LoadingSpinnerProps) => {
  const sizes = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  const colors = {
    blue: "border-blue-500",
    white: "border-white",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {text && (
        <p
          className={`mb-4 text-lg ${
            color === "white" ? "text-white" : "text-gray-700"
          }`}
        >
          {text}
        </p>
      )}
      <div
        className={`animate-spin rounded-full ${sizes[size]} border-t-4 border-b-4 ${colors[color]}`}
      ></div>
    </div>
  );
};
