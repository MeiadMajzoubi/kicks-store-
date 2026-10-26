"use client";

import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-16">
      <form noValidate onSubmit={placeOrder} aria-labelledby="checkout-title" className="order-last lg:order-first">
        <h1 id="checkout-title" className="text-2xl font-semibold tracking-[-0.02em]">
          Checkout
        </h1>

        <Section title="Contact">
          {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
        </Section>

        <Section title="Delivery address">
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

        <Section title="Delivery">
          <div className="flex items-center gap-4 rounded-2xl border border-foreground px-5 py-4">
            <FastTruckIcon className="h-6 w-8 shrink-0 text-brand" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">Express delivery</p>
              <p className="text-sm text-muted-foreground">Arrives by {arrivalDate()}</p>
            </div>
            <p className="text-[15px] font-semibold tabular-nums">{totals.delivery ? currency.format(totals.delivery) : "Free"}</p>
          </div>
        </Section>

        <Section title="Payment">
          {/* Said up front and plainly: this is a portfolio store. */}
          <p className="rounded-2xl bg-surface px-5 py-4 text-sm text-foreground/80">
            This is a demo store, so no payment is taken. Use the test card{" "}
            <span className="font-semibold whitespace-nowrap tabular-nums">4242 4242 4242 4242</span> with any future date and
            any 3-digit code.
          </p>
          {field("cardNumber", "Card number", { autoComplete: "cc-number", inputMode: "numeric", format: formatCardNumber })}
          <div className="grid gap-4 sm:grid-cols-2">
            {field("expiry", "Expiry date (MM/YY)", { autoComplete: "cc-exp", inputMode: "numeric", format: formatExpiry })}
            {field("cvc", "Security code", { autoComplete: "cc-csc", inputMode: "numeric", maxLength: 4 })}
          </div>
          {field("cardName", "Name on card", { autoComplete: "cc-name" })}
        </Section>

        <Button type="submit" variant="solid" size="pill-lg" className="mt-8 w-full sm:w-auto sm:min-w-64">
          <Lock aria-hidden="true" strokeWidth={2} className="size-4" />
          Pay {currency.format(totals.total)}
        </Button>
      </form>

      <Summary lines={lines} totals={totals} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mt-8 border-t border-border pt-6">
      <legend className="sr-only">{title}</legend>
      <h2 aria-hidden="true" className="panel-title">
        {title}
      </h2>
      <div className="grid gap-4">{children}</div>
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
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-[15px] tabular-nums transition-colors outline-none placeholder:text-muted-foreground hover:border-foreground/40 focus-visible:border-foreground focus-visible:outline-none aria-invalid:border-brand"
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-brand">
          {error}
        </p>
      )}
    </div>
  );
}

function Summary({ lines, totals }: { lines: Line[]; totals: ReturnType<typeof bagTotals> }) {
  return (
    <aside aria-labelledby="summary-title" className="lg:sticky lg:top-6 lg:self-start">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="summary-title" className="text-2xl font-semibold tracking-[-0.02em]">
          Summary
        </h2>
        <Link href="/cart" className="text-link">
          Edit bag
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-border border-t border-border">
        {lines.map((line) => (
          <SummaryLine key={line.key} line={line} />
        ))}
      </ul>

      <dl className="space-y-3 border-t border-border pt-5 text-[15px]">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{currency.format(totals.fullPrice)}</dd>
        </div>
        {totals.saving > 0 && (
          <div className="flex justify-between gap-4 text-brand">
            <dt>Sale savings</dt>
            <dd className="tabular-nums">−{currency.format(totals.saving)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt>Delivery</dt>
          <dd className="tabular-nums">{totals.delivery ? currency.format(totals.delivery) : "Free"}</dd>
        </div>
      </dl>

      <div className="mt-5 flex justify-between gap-4 border-y border-border py-4 text-base font-semibold">
        <span>Total</span>
        <span className="tabular-nums">{currency.format(totals.total)}</span>
      </div>
    </aside>
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
