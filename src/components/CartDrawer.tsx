import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { BagIcon, CloseIcon } from "./icons";

const FREE_SHIPPING_AT = 250;

export default function CartDrawer() {
  const { open, setOpen, items, count, subtotal, updateQty, remove, clear } =
    useCart();
  const navigate = useNavigate();

  const remaining = Math.max(0, FREE_SHIPPING_AT - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[75] flex w-full max-w-md flex-col bg-cream shadow-2xl"
            aria-label="Shopping bag"
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <p className="font-display font-condensed text-2xl font-extrabold uppercase tracking-tight">
                Your Bag{" "}
                <span className="tabular-nums text-terra">({count})</span>
              </p>
              <button
                type="button"
                aria-label="Close bag"
                onClick={() => setOpen(false)}
                className="transition-colors hover:text-terra"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand/60">
                  <BagIcon className="h-7 w-7 text-ink/40" />
                </div>
                <p className="font-display font-condensed text-2xl font-extrabold uppercase tracking-tight">
                  Your bag is empty
                </p>
                <p className="max-w-xs text-sm text-ink/50">
                  Fill it with warm knits, easy silks, and everyday staples.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="mx-6 mt-5">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
                    <div
                      className="h-full rounded-full bg-terra transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-ink/50">
                    {remaining > 0
                      ? `You're $${remaining.toFixed(2)} away from free shipping`
                      : "Free shipping unlocked"}
                  </p>
                </div>

                <ul className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex gap-4 border-b border-ink/5 py-4"
                    >
                      <Link
                        to={`/product/${item.productId}`}
                        onClick={() => setOpen(false)}
                        className="block h-20 w-16 shrink-0 overflow-hidden bg-sand/60"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium leading-snug">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-xs text-ink/50">
                              {[item.size, item.color].filter(Boolean).join(" · ") ||
                                "One size"}
                            </p>
                          </div>
                          <p className="text-sm font-semibold tabular-nums">
                            ${item.lineTotal.toFixed(2)}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center border border-ink/15">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQty(item.productId, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-lg text-ink/60 transition-colors hover:text-ink"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQty(item.productId, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center text-lg text-ink/60 transition-colors hover:text-ink"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.productId)}
                            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/40 transition-colors hover:text-terra"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-ink/10 px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="uppercase tracking-[0.2em] text-ink/50">
                      Subtotal
                    </span>
                    <span className="font-semibold tabular-nums">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/40">
                    Shipping &amp; taxes calculated at checkout.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate("/checkout");
                    }}
                    className="mt-4 flex w-full items-center justify-center bg-ink py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
                  >
                    Checkout
                  </button>
                  <button
                    type="button"
                    onClick={() => void clear()}
                    className="mt-2 w-full text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/40 transition-colors hover:text-terra"
                  >
                    Clear bag
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}