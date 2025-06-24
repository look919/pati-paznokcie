"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  PaginationState,
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "./button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

interface GridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnVisibilityFromProps?: Record<string, boolean>;
  defaultPageSize?: number;
  totalCount?: number;
  pageCount?: number;
  manualPagination?: boolean;
}

export function Grid<TData, TValue>({
  columns,
  data,
  columnVisibilityFromProps,
  defaultPageSize = 25,
  totalCount,
  pageCount: externalPageCount,
  manualPagination = false,
}: GridProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState(
    columnVisibilityFromProps || { Rifles: false }
  );

  // Get the pagination values from URL or use defaults
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 0;
  const pageSize = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : defaultPageSize;

  const pagination = React.useMemo<PaginationState>(
    () => ({
      pageIndex: page,
      pageSize: pageSize,
    }),
    [page, pageSize]
  );

  const [paginationState, setPaginationState] =
    React.useState<PaginationState>(pagination);

  // Update URL when pagination changes
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", paginationState.pageIndex.toString());
    params.set("limit", paginationState.pageSize.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [paginationState, pathname, router, searchParams]);

  // Update local state when URL changes
  React.useEffect(() => {
    setPaginationState(pagination);
  }, [pagination]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      pagination: paginationState,
    },
    pageCount:
      manualPagination && externalPageCount ? externalPageCount : undefined,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPaginationState,
    manualPagination,
  });

  if (table.getRowModel().rows.length === 0) {
    return (
      <div className="mx-auto text-center mt-6 border rounded-md p-2 sm:p-3 text-sm font-bold w-[300px] sm:w-[400px] md:w-[600px] ">
        Obecnie brak danych do wyświetlenia.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-600 w-full max-w-[1200px] 2xl:max-w-fit">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
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
                        "text-center border-x m-1 text-xs md:text-sm whitespace-nowrap"
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
                    className="border-x text-center text-xs 2xl:text-md py-1 px-1 md:px-2"
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

      <div className="flex items-center justify-between px-2 py-2 border-t">
        <div className="flex items-center gap-2 text-xs">
          <span>
            Strona {table.getState().pagination.pageIndex + 1} z{" "}
            {table.getPageCount()}
            {totalCount !== undefined && (
              <>
                {" "}
                · Razem: {totalCount}{" "}
                {totalCount === 1
                  ? "element"
                  : totalCount % 10 >= 2 &&
                    totalCount % 10 <= 4 &&
                    (totalCount % 100 < 10 || totalCount % 100 > 20)
                  ? "elementy"
                  : "elementów"}
              </>
            )}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Pierwsza strona</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Poprzednia strona</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Następna strona</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ostatnia strona</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
