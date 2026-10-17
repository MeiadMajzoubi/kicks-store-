import type { Metadata } from "next";
import Link from "next/link";
import Faq from "../components/info/Faq";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with your Red Kicks order. Our team is here around the clock.",
};

// Placeholder until the store has a real inbox; the .example domain can never reach anyone.
const SUPPORT_EMAIL = "support@redkicks.example";

const TOPICS = [
  { label: "Delivery", detail: "Express, arrives within 3 days", href: "/delivery" },
  { label: "Your bag", detail: "Sizes, quantities and checkout", href: "/cart" },
  { label: "Wishlist", detail: "Shoes you've saved", href: "/wishlist" },
  { label: "Sale", detail: "Current discounts", href: "/sale" },
];

const QUESTIONS = [
  {
    question: "Do I need an account?",
    answer:
      "No. Your bag and wishlist work as a guest and are saved on this device. Signing in is never required to shop.",
  },
  {
    question: "How do sizes work?",
    answer:
      "All sizes are UK sizes. On each shoe's page, sizes that are sold out are greyed out and can't be picked.",
  },
  {
    question: "Why did a shoe disappear from my bag?",
    answer: "If a shoe is no longer in our catalogue, it's removed from your bag so you're never charged for it.",
  },
  {
    question: "How fast is delivery?",
    answer: (
      <>
        Every order ships express and arrives within 3 days.{" "}
        <Link href="/delivery" className="font-medium text-foreground underline underline-offset-4 hover:text-brand">
          Delivery details
        </Link>
      </>
    ),
  },
];

export default function SupportPage() {
  return (
    <main id="main-content" tabIndex={-1} className="content-shell flex-1 pt-10 pb-20 outline-none sm:pt-14">
      <div className="max-w-3xl">
        <h1 className="section-title">Support</h1>
        <p className="mt-3 text-base text-foreground/75 sm:text-lg">
          Our team is here around the clock, every day of the year.
        </p>

        <nav aria-labelledby="topics-title" className="mt-10">
          <h2 id="topics-title" className="panel-title">Get help with</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {TOPICS.map((topic) => (
              <li key={topic.label}>
                <Link
                  href={topic.href}
                  className="flex min-h-16 flex-col justify-center rounded-lg bg-surface px-5 py-3 transition-colors hover:bg-surface-hover"
                >
                  <span className="text-[15px] font-semibold">{topic.label}</span>
                  <span className="text-sm text-muted-foreground">{topic.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <h2 className="panel-title mt-14">Common questions</h2>
        <Faq items={QUESTIONS} />

        <section aria-labelledby="contact-title" className="mt-14 border-t border-border pt-8">
          <h2 id="contact-title" className="panel-title">Still need help?</h2>
          <p className="text-[15px] text-foreground/75">
            Email us any time and we&rsquo;ll reply within 24 hours.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-4 inline-flex min-h-12 items-center rounded-full bg-foreground px-7 text-[15px] font-medium text-background transition-opacity hover:opacity-85"
          >
            Email support
          </a>
        </section>
      </div>
    </main>
  );
}
