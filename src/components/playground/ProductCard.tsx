import { useId } from "react";
import { formatIdr } from "@/lib/playground/format-idr";

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  available: boolean;
};

export type ProductCardProps = {
  product: Product;
  onAdd: (productId: string) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { id, name, price, imageUrl, available } = product;
  const titleId = useId();

  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-col overflow-hidden rounded-md border border-line bg-card"
    >
      <div className="aspect-square bg-accent-soft">
        {/* A plain <img>: imageUrl can be any host, which next/image would
            only accept if it were listed in next.config. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover ${available ? "" : "opacity-50 grayscale"}`}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 id={titleId} className="line-clamp-2 font-medium">
          {name}
        </h3>

        <p className={`text-lg font-semibold ${available ? "" : "text-muted"}`}>
          <data value={price}>{formatIdr(price)}</data>
        </p>

        {/* aria-describedby gives screen readers the product name without
            changing the button's visible name, "Add to cart". */}
        <button
          type="button"
          disabled={!available}
          aria-describedby={titleId}
          onClick={() => onAdd(id)}
          className="mt-auto rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:opacity-100"
        >
          {available ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </article>
  );
}
