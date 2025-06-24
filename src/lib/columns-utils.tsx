import { ColumnDef, Getter } from "@tanstack/react-table";
import { formatDateAndTime } from "@/lib/time";

export const renderDecimalValue = (getValue: Getter<number>) => {
  const value = getValue<number | undefined>();

  if (value === null) {
    return "-";
  }
  return typeof value === "number" ? parseFloat(getValue().toFixed(2)) : "0";
};

export const renderCell = (
  getValue: Getter<string | number | Date | undefined>
) => {
  const value = getValue<string | number | Date | undefined>();
  if (value === null || value === undefined) {
    return "-";
  }

  if (value instanceof Date) {
    return formatDateAndTime(value);
  }

  return typeof value === "number" ? parseFloat(value.toFixed(2)) : value;
};

export const renderDecimalPercentageValue = (getValue: Getter<number>) => {
  const value = getValue<number | undefined>();

  if (value === null) {
    return "-";
  }
  return typeof value === "number"
    ? `${parseFloat(getValue().toFixed(2))}%`
    : "0%";
};

type CreateColumnOptions<T> = Partial<ColumnDef<T>> & {
  // percentageDisplay?: boolean;
};

export type AnyGridRecord = {
  id?: string;
  name?: string;
  avatar?: string;
  gamesPlayed?: number;
};

export const createColumn = <T,>(
  accessorKey: keyof T,
  header: string,
  options?: CreateColumnOptions<T>
): ColumnDef<T> => ({
  accessorKey,
  header,
  cell: ({ getValue }) => renderCell(getValue),
  minSize: 30,
  ...options,
});

export const createIndexColumn = <T,>(): ColumnDef<T> => ({
  accessorKey: "No.",
  header: "No.",
  cell: ({ row, table }) => {
    const sortedIndex = table
      .getSortedRowModel()
      .flatRows.findIndex((r) => r.id === row.id);
    return sortedIndex + 1;
  },
  maxSize: 20,
  enableSorting: false,
  enableHiding: false,
});
