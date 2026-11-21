"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SHOW_MS = 8000;

type UndoToastProps = {
  /** What was removed, e.g. "Jordan Retro 11 from your bag". Nothing shows while this is null. */
  message: string | null;
  onUndo: () => void;
  onDismiss: () => void;
};

/**
 * A small bar at the bottom of the screen after something is removed: what happened, and one button to
 * take it back. It goes away by itself after 8 seconds, but waits while the pointer or keyboard is on it.
 * The wrapper is always on the page so screen readers announce the message when it appears.
 */
export default function UndoToast({ message, onUndo, onDismiss }: UndoToastProps) {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!message || held) return;
    const timer = window.setTimeout(onDismiss, SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [message, held, onDismiss]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-center">
      {message && (
        <div
          key={message}
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeld(false);
          }}
          className="pointer-events-auto flex w-full max-w-lg items-center rounded-lg border border-background/15 bg-foreground py-1 pr-1 pl-4 text-sm text-background shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <p className="line-clamp-2 min-w-0 flex-1 py-2 pr-2 leading-snug">{message}</p>
          <button
            type="button"
            onClick={onUndo}
            className="min-h-11 shrink-0 rounded-md px-3 font-semibold text-brand-bright underline underline-offset-4 transition-colors duration-150 hover:bg-background/10"
          >
            Undo
          </button>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="flex size-11 shrink-0 items-center justify-center rounded-md text-background/60 transition-colors duration-150 hover:bg-background/10 hover:text-background"
          >
            <X aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
