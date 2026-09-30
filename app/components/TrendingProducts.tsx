import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts, sortByColor } from "@/data/mockProducts";

const men = sortByColor(mockProducts.filter((p) => p.gender === "men"));
const women = sortByColor(mockProducts.filter((p) => p.gender === "women"));

const collections = [
  { value: "men", label: "Men", products: men },
  { value: "women", label: "Women", products: women },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Image layer: fades out first, scales down and blurs slightly.
// Base classes = leaving hover (quick), group-hover classes = entering hover (slower).
const imageLayer = `
  relative size-36 max-w-full lg:size-40
  transition-[opacity,scale,filter]
  duration-500 delay-100 ease-out
  lg:group-hover:delay-0 lg:group-hover:duration-700
  lg:group-hover:ease-[cubic-bezier(0.22,1,0.36,1)]
  lg:group-hover:scale-90 lg:group-hover:opacity-0 lg:group-hover:blur-sm
  lg:group-focus-visible:scale-90 lg:group-focus-visible:opacity-0 lg:group-focus-visible:blur-sm
  motion-reduce:transition-none
  motion-reduce:scale-100! motion-reduce:blur-none!
`;

// Text lines: each one rises and fades in, staggered via a per-line delay.
const revealLine = `
  lg:translate-y-5 lg:opacity-0
  lg:transition-[opacity,translate]
  lg:duration-350 lg:ease-out
  lg:group-hover:translate-y-0 lg:group-hover:opacity-100
  lg:group-hover:duration-700
  lg:group-hover:ease-[cubic-bezier(0.22,1,0.36,1)]
  lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100
  motion-reduce:transition-none
  motion-reduce:translate-y-0!
`;

export default function TrendingProducts() {
  return (
    <section
      aria-label="Trending products"
      className="mx-4 my-8 overflow-hidden rounded-3xl bg-[#f5f5f5] px-4 py-7 text-black sm:px-7"
    >
      <Tabs defaultValue="men" className="w-full gap-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList
            aria-label="Trending collections"
            className="h-11 w-max gap-0 rounded-full border border-black bg-white p-0 text-black"
          >
            {collections.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="h-full flex-none cursor-pointer rounded-full border border-transparent px-5 text-sm font-semibold text-black shadow-none after:hidden aria-selected:border-black aria-selected:bg-[#c6c6c6]! aria-selected:shadow-none sm:px-6 sm:text-base"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Link
            href="/shop"
            className="shrink-0 text-sm font-semibold text-red-600 underline underline-offset-4 transition-colors hover:text-red-700 sm:mr-6 sm:text-base"
          >
            Shop all
          </Link>
        </div>

        {collections.map(({ value, products }) => (
          <TabsContent key={value} value={value} className="mt-6">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
              {products.map((product) => (
                <li key={product.id} className="min-w-0">
                  <Link
                    href={`/products/${product.id}`}
                    className="group relative flex min-h-[184px] flex-col items-center justify-center rounded-sm py-3 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
                  >
                    <div className={imageLayer}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 160px, 144px"
                        className="object-contain"
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1 px-2 text-center lg:absolute lg:inset-0">
                      <h3
                        className={`${revealLine} text-sm font-semibold lg:group-hover:delay-200`}
                      >
                        {product.name}
                      </h3>

                      <p
                        className={`${revealLine} text-sm text-neutral-600 lg:group-hover:delay-300`}
                      >
                        {product.brand}
                      </p>

                      <p
                        className={`${revealLine} text-sm lg:group-hover:delay-[400ms]`}
                      >
                        {currency.format(product.price)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
