"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props<T> = {
  value: string;
  onValueChange: (value: string) => void;
  data: T extends { id: string; label: string; searchData?: string }[]
    ? T
    : never;
  placeholder: string;
  className?: string;
};

export function Combobox<T>(props: Props<T>) {
  const { placeholder, data, value, onValueChange, className } = props;
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter items based on search query across the label or searchData content
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return data;

    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) => {
      // Use searchData field if available, otherwise fall back to label
      const searchableText = item.searchData || item.label.toLowerCase();
      return searchableText.includes(lowerQuery);
    });
  }, [data, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value ? data.find((item) => item.id === value)?.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              Brak wyników dla &ldquo;{searchQuery}&rdquo;
            </CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label} // Use label for filtering instead of id
                  onSelect={() => {
                    onValueChange(item.id);
                    setSearchQuery("");
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
