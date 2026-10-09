import { useState } from "react";
import { useCart } from "../context/CartContext";
import { BagIcon } from "./icons";

type Props = {
  product: { id: string; name: string; price: number; image: string };
  className?: string;
};

export default function AddToCartButton({ product, className }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        if (added) return;
        await add({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
      className={
        className ??
        "mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-terra"
      }
    >
      <BagIcon className="h-4 w-4" />
      {added ? "Added to Bag" : "Add to Cart"}
    </button>
  );
}