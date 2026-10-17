import type { Metadata } from "next";
import Link from "next/link";
import FastTruckIcon from "../components/icons/FastTruckIcon";
import Faq from "../components/info/Faq";

export const metadata: Metadata = {
  title: "Delivery",
  description: "Every Red Kicks order ships express and arrives within 3 days.",
};

const FACTS = [
  { label: "Delivery time", value: "Within 3 days of your order" },
  { label: "Delivery method", value: "Express, on every order" },
  { label: "Delivery cost", value: "Shown at checkout" },
];

const QUESTIONS = [
  {
    question: "When will my order arrive?",
    answer: "Every order ships express and arrives within 3 days of the day you place it.",
  },
  {
    question: "Do I need an account to order?",
    answer:
      "No. You can shop as a guest: your bag and wishlist are saved on your device without signing in.",
  },
  {
    question: "Can I change my delivery address after ordering?",
    answer: (
      <>
        Contact our <Link href="/support" className="font-medium text-foreground underline underline-offset-4 hover:text-brand">support team</Link> as
        soon as possible. We can update the address until your order has left our warehouse.
      </>
    ),
  },
  {
    question: "What happens if I'm not home?",
    answer: "The courier will leave a note with options to rebook delivery or collect your parcel nearby.",
  },
];

export default function DeliveryPage() {
  return (
    <main id="main-content" tabIndex={-1} className="content-shell flex-1 pt-10 pb-20 outline-none sm:pt-14">
      <div className="max-w-3xl">
        <FastTruckIcon className="h-10 w-14 text-brand" />
        <h1 className="section-title mt-5">Delivery</h1>
        <p className="mt-3 text-base text-foreground/75 sm:text-lg">
          Every order ships express and arrives within 3 days.
        </p>

        <dl className="mt-10 border-t border-border">
          {FACTS.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:justify-between sm:gap-6">
              <dt className="text-[15px] text-muted-foreground">{fact.label}</dt>
              <dd className="text-[15px] font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="panel-title mt-14">Common questions</h2>
        <Faq items={QUESTIONS} />

        <p className="mt-10 text-[15px] text-muted-foreground">
          Still need help?{" "}
          <Link href="/support" className="font-medium text-foreground underline underline-offset-4 hover:text-brand">
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
}
