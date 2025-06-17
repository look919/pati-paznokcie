"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface GridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnVisibilityFromProps?: Record<string, boolean>;
}

export function Grid<TData, TValue>({
  columns,
  data,
  columnVisibilityFromProps,
}: GridProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState(
    columnVisibilityFromProps || { Rifles: false }
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  if (table.getRowModel().rows.length === 0) {
    return (
      <div className="text-center mt-12 border rounded-md p-3 font-bold">
        Currently there is no data to display
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-600">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-gray-400">
              {headerGroup.headers.map((header) =>
                header.column.getIsVisible() ? (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.getCanSort()
                        ? "cursor-pointer select-none hover:bg-gray-500"
                        : "",
                      "text-center border-x m-1 text-sm"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex justify-center items-center">
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                        <div>
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </div>
                    )}
                  </TableHead>
                ) : null
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="hover:bg-gray-300"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="border-x"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
