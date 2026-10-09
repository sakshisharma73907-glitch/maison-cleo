import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api, apiErrorMessage } from "../lib/api";
import { useCart } from "../context/CartContext";
import type { CatalogProduct } from "../lib/types";
import { BagIcon } from "../components/icons";

export default function ProductPage() {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const { add, setOpen } = useCart();

  useEffect(() => {
    let active = true;
    setError(null);
    api
      .get<{ product: CatalogProduct }>(`/products/${id}`)
      .then((res) => {
        if (!active) return;
        setProduct(res.data.product);
        if (res.data.product.sizes.length > 0)
          setSize(res.data.product.sizes[1] ?? res.data.product.sizes[0]);
        if (res.data.product.colors.length > 0)
          setColor(res.data.product.colors[0]);
      })
      .catch((e) => {
        if (active) setError(apiErrorMessage(e));
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display font-condensed text-3xl font-black uppercase tracking-tight">
          We couldn&apos;t find that piece
        </p>
        <p className="text-sm text-ink/50">{error}</p>
        <Link
          to="/"
          className="mt-2 bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm uppercase tracking-[0.3em] text-ink/40">
          Loading…
        </p>
      </div>
    );
  }

  const images = [product.image, product.hover ?? product.image];

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-24 sm:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40"
      >
        <Link to="/" className="transition-colors hover:text-terra">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/" className="transition-colors hover:text-terra">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex">
          {images.length > 1 && (
            <div className="hidden flex-col gap-3 pr-3 sm:flex">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => window.scrollTo({ top: 0 })}
                  className="h-24 w-20 shrink-0 overflow-hidden border border-ink/10"
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="relative flex-1 overflow-hidden bg-sand/40">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            {product.tag && (
              <span className="absolute left-4 top-4 bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                {product.tag}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:pr-8 xl:pr-16"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-terra">
            {product.category}
          </p>
          <h1 className="font-display font-condensed mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold tabular-nums">
            ${product.price.toFixed(2)}
          </p>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <p className="mt-1 text-sm text-ink/40 line-through tabular-nums">
              ${product.compareAtPrice.toFixed(2)}
            </p>
          )}

          <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink/70">
            {product.description}
          </p>

          {product.colors.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                Color — <span className="text-ink">{color ?? "Select"}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`border px-4 py-2 text-xs font-medium transition-colors ${
                      color === c
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/15 hover:border-ink"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                Size — <span className="text-ink">{size ?? "Select"}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex h-11 w-14 items-center justify-center border text-xs font-medium transition-colors ${
                      size === s
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/15 hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-ink/15">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center text-xl text-ink/60 transition-colors hover:text-ink"
              >
                −
              </button>
              <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-12 w-12 items-center justify-center text-xl text-ink/60 transition-colors hover:text-ink"
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled={!product.inStock}
              onClick={async () => {
                setAddError(null);
                const missing = [];
                if (product.sizes.length > 0 && !size) missing.push("size");
                if (product.colors.length > 0 && !color) missing.push("color");
                if (missing.length > 0) {
                  setAddError(
                    `Please select a ${missing.join(" and ")} to continue.`,
                  );
                  return;
                }
                if (!product.inStock) {
                  setAddError("This piece is out of stock.");
                  return;
                }
                try {
                  await add({
                    productId: product.slug,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: qty,
                    size,
                    color,
                  });
                  setAdded(true);
                  setTimeout(() => {
                    setAdded(false);
                    setOpen(true);
                  }, 500);
                } catch (e) {
                  setAddError(apiErrorMessage(e));
                }
              }}
              className={`flex flex-1 min-w-56 items-center justify-center gap-2 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors sm:flex-none ${
                product.inStock ? "bg-ink hover:bg-terra" : "cursor-not-allowed bg-ink/30"
              }`}
            >
              <BagIcon className="h-4 w-4" />
              {added ? "Added to Bag" : "Add to Bag"}
            </button>
          </div>
          {addError && <p className="mt-3 text-sm text-terra">{addError}</p>}
          {!product.inStock && (
            <p className="mt-3 text-sm text-ink/50">
              This piece is currently out of stock. Join the waitlist below.
            </p>
          )}

          <dl className="mt-10 space-y-4 border-t border-ink/10 pt-8 text-sm">
            <div className="flex justify-between gap-6">
              <dt className="text-ink/50">Shipping</dt>
              <dd className="text-right">Free over $250 · $12 flat otherwise</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-ink/50">Returns</dt>
              <dd className="text-right">30 days, no questions asked</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-ink/50">Store</dt>
              <dd className="text-right">1112 Eastland Ave, Nashville</dd>
            </div>
          </dl>

          <p className="mt-10 text-xs uppercase tracking-[0.25em] text-ink/30">
            Maison Cleo
          </p>
        </motion.div>
      </div>
    </div>
  );
}