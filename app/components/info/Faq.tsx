import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = { question: string; answer: ReactNode };

/** Questions that open in place; native <details>, so it works without JavaScript. */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-border">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-border">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 text-base font-medium [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <div className="max-w-2xl pb-6 text-[15px] leading-relaxed text-foreground/75">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
