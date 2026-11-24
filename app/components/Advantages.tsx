import Link from "next/link";
import { getProducts } from "@/lib/products";

// Four things a shopper gets, each one big number and a short line. The brand count comes from the
// database, so it stays true as products change; the rest are the store's standing promises.
async function getFacts() {
  const products = await getProducts();
  const brandCount = new Set(products.map((product) => product.brand.name)).size;

  return [
    { value: "24/7", label: "Customer service, every day", href: "/support" },
    { value: "3 days", label: "On-time delivery guarantee", href: "/delivery" },
    { value: String(brandCount), label: "Brands in the store", href: "/brands" },
    { prefix: "Up to", value: "70%", label: "Off sale styles", href: "/sale" },
  ];
}

export default async function Advantages() {
  const facts = await getFacts();

  return (
    <section
      aria-labelledby="advantages-title"
      className="content-shell section-space border-t border-border"
    >
      <h2 id="advantages-title" className="section-title mb-8 sm:mb-10">Why choose us</h2>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-x-8">
        {facts.map(({ prefix, value, label, href }) => (
          <li key={href}>
            <Link href={href} className="group flex flex-col gap-2 border-t-2 border-foreground pt-4">
              <span className="page-title tabular-nums">
                {prefix && <span className="mr-1 text-[0.35em] tracking-normal">{prefix} </span>}
                {value}
              </span>
              <span className="text-base text-foreground group-hover:underline group-hover:underline-offset-4">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
