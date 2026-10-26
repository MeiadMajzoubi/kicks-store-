"use client";

import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearCart, useCart } from "@/lib/cart";
import { colourName, effectivePrice } from "@/lib/catalog";
import {
  arrivalDate,
  bagLines,
  bagTotals,
  currency,
  formatCardNumber,
  formatExpiry,
  isCardNumber,
  isCvc,
  isEmail,
  isExpiry,
  newOrderNumber,
  type Line,
} from "@/lib/checkout";
import FastTruckIcon from "../icons/FastTruckIcon";
import OrderTotals from "../cart/OrderTotals";

// Same as the bag: the server can't see the browser's bag, so wait for the page to load.
const noop = () => () => {};
const useHasLoaded = () => useSyncExternalStore(noop, () => true, () => false);

type Fields = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardName: string;
};

const EMPTY_FIELDS: Fields = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postcode: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  cardName: "",
};

/** Each field's check, and the message that says how to fix it. */
const CHECKS: { [K in keyof Fields]: [(value: string) => boolean, string] } = {
  email: [isEmail, "Enter an email like name@example.com"],
  firstName: [(v) => v.trim() !== "", "Enter your first name"],
  lastName: [(v) => v.trim() !== "", "Enter your last name"],
  address: [(v) => v.trim() !== "", "Enter your street address"],
  city: [(v) => v.trim() !== "", "Enter your town or city"],
  postcode: [(v) => v.trim() !== "", "Enter your postcode"],
  cardNumber: [isCardNumber, "Enter a valid card number, for example 4242 4242 4242 4242"],
  expiry: [isExpiry, "Enter a future date as MM/YY"],
  cvc: [isCvc, "Enter the 3 or 4 digits on the back of the card"],
  cardName: [(v) => v.trim() !== "", "Enter the name on the card"],
};

type Order = { number: string; email: string; lines: Line[]; total: number; arrives: string };

export default function CheckoutView() {
  const loaded = useHasLoaded();
  const cart = useCart();
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [order, setOrder] = useState<Order | null>(null);

  const lines = bagLines(cart);
  const totals = bagTotals(lines);

  if (!loaded) return <div aria-hidden="true" className="min-h-[50vh]" />;
  if (order) return <Confirmation order={order} />;

  if (!lines.length) {
    return (
      <div className="pb-10">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Checkout</h1>
        <p className="mt-3 text-[15px] text-muted-foreground">Your bag is empty, so there’s nothing to check out.</p>
        <Link href="/shop" className="text-link mt-2">
          Start shopping
        </Link>
      </div>
    );
  }

  const set = (name: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [name]: value }));
    // Clear a field's error as soon as it's edited.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: Partial<Record<keyof Fields, string>> = {};
    for (const name of Object.keys(CHECKS) as (keyof Fields)[]) {
      const [isValid, message] = CHECKS[name];
      if (!isValid(fields[name])) found[name] = message;
    }
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setOrder({
      number: newOrderNumber(),
      email: fields.email.trim(),
      lines,
      total: totals.total,
      arrives: arrivalDate(),
    });
    clearCart();
    window.scrollTo({ top: 0 });
  };

  const field = (name: keyof Fields, label: string, props: FieldProps = {}) => (
    <Field
      name={name}
      label={label}
      value={fields[name]}
      error={errors[name]}
      onChange={(value) => set(name, props.format ? props.format(value) : value)}
      {...props}
    />
  );

  return (
    <div>
      {/* Apple-style bar: the page name, and the order one click away instead of a sidebar. */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <p className="text-xl font-semibold tracking-[-0.02em]">Checkout</p>
        <OrderDrawer lines={lines} totals={totals} />
      </div>

      <form noValidate onSubmit={placeOrder} aria-labelledby="checkout-title" className="pt-10 sm:pt-14">
        <h1 id="checkout-title" className="section-title max-w-[22ch]">
          Where should we send your order?
        </h1>

        <Section title="Your name and address" note="Every order ships express and arrives within 3 days.">
          <div className="grid gap-4 sm:grid-cols-2">
            {field("firstName", "First name", { autoComplete: "given-name" })}
            {field("lastName", "Last name", { autoComplete: "family-name" })}
          </div>
          {field("address", "Street address", { autoComplete: "street-address" })}
          <div className="grid gap-4 sm:grid-cols-2">
            {field("city", "Town or city", { autoComplete: "address-level2" })}
            {field("postcode", "Postcode", { autoComplete: "postal-code" })}
          </div>
        </Section>

        <Section title="How can we reach you?" note="We’ll send your receipt and delivery updates here.">
          {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
        </Section>

        <Section title="Delivery">
          <div className="flex items-center gap-4 rounded-xl border border-foreground px-5 py-4">
            <FastTruckIcon className="h-6 w-8 shrink-0 text-brand" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">Express delivery</p>
              <p className="text-sm text-muted-foreground">Arrives by {arrivalDate()}</p>
            </div>
            <p className="text-[15px] font-semibold tabular-nums">{totals.delivery ? currency.format(totals.delivery) : "Free"}</p>
          </div>
        </Section>

        <Section
          title="How would you like to pay?"
          note={
            // Said up front and plainly: this is a portfolio store.
            <>
              This is a demo store, so no payment is taken. Use the test card{" "}
              <span className="font-semibold whitespace-nowrap text-foreground tabular-nums">4242 4242 4242 4242</span> with any
              future date and any 3-digit code.
            </>
          }
        >
          {field("cardNumber", "Card number", { autoComplete: "cc-number", inputMode: "numeric", format: formatCardNumber })}
          <div className="grid gap-4 sm:grid-cols-2">
            {field("expiry", "Expiry date (MM/YY)", { autoComplete: "cc-exp", inputMode: "numeric", format: formatExpiry })}
            {field("cvc", "Security code", { autoComplete: "cc-csc", inputMode: "numeric", maxLength: 4 })}
          </div>
          {field("cardName", "Name on card", { autoComplete: "cc-name" })}
        </Section>

        <div className="mt-12 max-w-[560px] border-t border-border pt-8">
          <Button type="submit" variant="solid" size="pill-lg" className="w-full">
            <Lock aria-hidden="true" strokeWidth={2} className="size-4" />
            Pay {currency.format(totals.total)}
          </Button>
        </div>
      </form>
    </div>
  );
}

/** A form step: fields on the left, a short note beside them on wide screens (Apple's "Some things to keep in mind"). */
function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <fieldset className="mt-12 grid gap-x-16 gap-y-4 lg:grid-cols-[minmax(0,560px)_minmax(0,300px)]">
      <legend className="sr-only">{title}</legend>
      <h2 aria-hidden="true" className="text-xl font-semibold tracking-[-0.02em] lg:col-start-1">
        {title}
      </h2>
      <div className="grid gap-4 lg:col-start-1">{children}</div>
      {note && (
        <p className="text-sm leading-relaxed text-muted-foreground lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-1">
          {note}
        </p>
      )}
    </fieldset>
  );
}

type FieldProps = {
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "numeric" | "text";
  maxLength?: number;
  format?: (value: string) => string;
};

function Field({
  name,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
}: FieldProps & { name: string; label: string; value: string; error?: string; onChange: (value: string) => void }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-xl border border-foreground/25 bg-background px-4 text-base tabular-nums transition-[border-color,box-shadow] duration-150 outline-none hover:border-foreground/50 focus-visible:border-foreground focus-visible:shadow-[0_0_0_1px_var(--foreground)] focus-visible:outline-none aria-invalid:border-brand aria-invalid:focus-visible:shadow-[0_0_0_1px_var(--brand)]"
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-brand">
          {error}
        </p>
      )}
    </div>
  );
}

/** "Show order summary: $X" opens the bag in a side panel, like Apple's checkout. */
function OrderDrawer({ lines, totals }: { lines: Line[]; totals: ReturnType<typeof bagTotals> }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-link min-h-11 text-right">
        Show order summary: <span className="tabular-nums">{currency.format(totals.total)}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col overflow-y-auto bg-background px-6 pt-6 pb-10 shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none data-ending-style:translate-x-full data-starting-style:translate-x-full motion-reduce:transition-none sm:px-10">
          <Dialog.Close
            aria-label="Close order summary"
            className="flex size-11 shrink-0 items-center justify-center self-end rounded-full bg-surface transition-colors hover:bg-surface-hover"
          >
            <X aria-hidden="true" strokeWidth={1.75} className="size-5" />
          </Dialog.Close>

          <Dialog.Title className="mt-2 border-b border-foreground pb-4 text-2xl font-semibold tracking-[-0.02em]">
            Your order
          </Dialog.Title>

          <div className="flex items-baseline justify-between gap-4 pt-5">
            <p className="font-semibold tabular-nums">
              {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
            </p>
            <Link href="/cart" className="text-link">
              Edit bag
            </Link>
          </div>

          <ul className="mt-2 divide-y divide-border border-b border-border">
            {lines.map((line) => (
              <SummaryLine key={line.key} line={line} />
            ))}
          </ul>

          <div className="pt-5">
            <OrderTotals totals={totals} />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SummaryLine({ line }: { line: Line }) {
  const variant = line.product.variants[line.variant];
  return (
    <li className="flex gap-4 py-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface">
        <Image src={variant.image} alt="" fill sizes="80px" className="object-contain p-1.5" />
      </div>
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold leading-snug">{line.product.name}</p>
        <p className="text-foreground/75">{colourName(variant.colors)}</p>
        <p className="text-foreground/75 tabular-nums">
          UK {line.size}
          {line.quantity > 1 ? `, quantity ${line.quantity}` : ""}
        </p>
      </div>
      <p className="shrink-0 text-sm font-semibold tabular-nums">
        {currency.format(effectivePrice(line.product) * line.quantity)}
      </p>
    </li>
  );
}

function Confirmation({ order }: { order: Order }) {
  return (
    <div className="mx-auto max-w-xl pb-10">
      <FastTruckIcon className="h-10 w-14 text-brand" />
      <h1 className="section-title mt-5">Order placed</h1>
      <p className="mt-3 text-[15px] text-foreground/75">
        Order <span className="font-semibold text-foreground tabular-nums">{order.number}</span> arrives by{" "}
        <span className="font-semibold text-foreground">{order.arrives}</span>. In a real store, a confirmation would go
        to {order.email}.
      </p>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {order.lines.map((line) => (
          <SummaryLine key={line.key} line={line} />
        ))}
      </ul>
      <div className="flex justify-between gap-4 border-b border-border py-4 text-base font-semibold">
        <span>Paid (demo)</span>
        <span className="tabular-nums">{currency.format(order.total)}</span>
      </div>

      <Link href="/shop" className="text-link mt-6">
        Continue shopping
      </Link>
    </div>
  );
}
