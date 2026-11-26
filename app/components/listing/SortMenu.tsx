import { ChevronDown } from "lucide-react";
import { SORT_OPTIONS, type SortKey } from "@/lib/catalog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Opens from its trigger (transform-origin follows the button), quick and without bounce. */
export default function SortMenu({ value, onChange }: { value: SortKey; onChange: (value: SortKey) => void }) {
  const current = SORT_OPTIONS.find((option) => option.value === value)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group/sort inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium">
        <span className="hidden text-muted-foreground sm:inline">Sort by</span>
        <span>{current}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-data-[popup-open]/sort:rotate-180 motion-reduce:transition-none"
          strokeWidth={1.75}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-60 rounded-lg p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.22)] ring-border duration-150"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as SortKey)}>
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              closeOnClick
              className="min-h-11 rounded-lg px-3 text-[15px] focus:bg-surface data-checked:font-semibold"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
