"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type FilterSheetProps = {
  resultCount: number;
  activeCount: number;
  onClear: () => void;
  onClose: () => void;
  children: ReactNode;
};

/** Full-screen filter panel for phones and tablets. */
export default function FilterSheet({ resultCount, activeCount, onClear, onClose, children }: FilterSheetProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), summary',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-sheet-title"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[100] flex flex-col bg-background animate-in fade-in slide-in-from-bottom-4 duration-200 motion-reduce:animate-none lg:hidden"
    >
      <div className="flex min-h-16 items-center justify-between border-b border-border px-4">
        <h2 id="filter-sheet-title" className="text-lg font-semibold">Filter</h2>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="flex size-11 items-center justify-center rounded-full bg-surface"
        >
          <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">{children}</div>

      <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="min-h-12 rounded-full border border-border text-[15px] font-medium disabled:text-muted-foreground"
        >
          Clear{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-12 rounded-full bg-foreground text-[15px] font-medium text-background"
        >
          Show {resultCount} {resultCount === 1 ? "result" : "results"}
        </button>
      </div>
    </div>
  );
}
