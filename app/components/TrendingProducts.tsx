import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Product = {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number | null;
  href: string;
};

const men: Product[] = Array.from({ length: 20 }, (_, index) => ({
  id: `m${index + 1}`,
  image: `/Products/m${index + 1}.webp`,
  name: `Men's sneaker ${index + 1}`,
  category: "Men Shoes",
  price: null,
  href: `/products/m${index + 1}`,
}));

const women: Product[] = Array.from({ length: 20 }, (_, index) => ({
  id: `w${index + 1}`,
  image: `/Products/w${index + 1}.avif`,
  name: `Women's sneaker ${index + 1}`,
  category: "Women Shoes",
  price: null,
  href: `/products/w${index + 1}`,
}));

const collections = [
  { value: "men", label: "Men", products: men },
  { value: "women", label: "Women", products: women },
];

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

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
                    href={product.href}
                    className="group relative flex min-h-[184px] flex-col items-center justify-center rounded-sm py-3 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
                  >
                    <div
                      className="
                        relative size-36 max-w-full lg:size-40
                        transition-[opacity,transform]
                        duration-[1200ms] ease-in-out
                        lg:group-hover:delay-150
                        lg:group-hover:scale-95
                        lg:group-hover:opacity-0
                        lg:group-focus-visible:scale-95
                        lg:group-focus-visible:opacity-0
                        motion-reduce:transform-none
                        motion-reduce:transition-none
                      "
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 160px, 144px"
                        className="object-contain"
                      />
                    </div>

                    <div
                      className="
                        flex flex-col items-center justify-center
                        gap-1 px-2 text-center
                        transition-[opacity,transform]
                        duration-[1200ms] ease-in-out
                        lg:absolute lg:inset-0
                        lg:translate-y-3 lg:opacity-0
                        lg:group-hover:delay-150
                        lg:group-hover:translate-y-0
                        lg:group-hover:opacity-100
                        lg:group-focus-visible:translate-y-0
                        lg:group-focus-visible:opacity-100
                        motion-reduce:transform-none
                        motion-reduce:transition-none
                      "
                    >
                      <h3 className="text-sm font-semibold">{product.name}</h3>

                      <p className="text-sm text-neutral-600">
                        {product.category}
                      </p>

                      {product.price !== null && (
                        <p className="text-sm">
                          {currency.format(product.price)}
                        </p>
                      )}
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
