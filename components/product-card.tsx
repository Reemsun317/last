import Image from "next/image";
import { PackageCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded border border-stone-200 bg-white">
      <div className="relative h-36 bg-stone-100">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-400">
            <PackageCheck className="h-9 w-9" />
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-ink">{product.name}</h3>
          <span className="whitespace-nowrap text-sm font-bold text-palm">{formatNaira(product.price)}</span>
        </div>
        <p className="line-clamp-2 text-xs text-stone-600">{product.description ?? product.category}</p>
        <span className="inline-flex rounded bg-stone-100 px-2 py-1 text-xs font-medium capitalize text-stone-700">
          {product.stock_status.replace("_", " ")}
        </span>
      </div>
    </article>
  );
}
