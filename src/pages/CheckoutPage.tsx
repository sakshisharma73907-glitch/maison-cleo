import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const TAX_RATE = 0.0825;
const FREE_SHIPPING_AT = 250;
const FLAT_SHIPPING = 12;

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const shipping = subtotal >= FREE_SHIPPING_AT || subtotal === 0 ? 0 : FLAT_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<{ url: string | null }>("/checkout/sessions", {
        email,
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("No payment URL returned.");
      }
    } catch (err) {
      setError(apiErrorMessage(err));
      setBusy(false);
    }
  }

  if (items.length === 0 && !busy) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <p className="font-display font-condensed text-3xl font-black uppercase tracking-tight">
          Your bag is empty
        </p>
        <p className="text-sm text-ink/50">Add a few pieces before checking out.</p>
        <Link
          to="/"
          className="mt-2 bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-cream">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            to="/"
            className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/50 transition-colors hover:text-terra"
          >
            Maison Cleo
          </Link>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            Secure Checkout
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_380px]">
        <div>
          <h1 className="font-display font-condensed text-4xl font-black uppercase tracking-tight">
            Checkout
          </h1>
          <form onSubmit={onSubmit} className="mt-8 max-w-lg space-y-4">
            <div>
              <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
              />
            </div>
            <p className="text-xs leading-relaxed text-ink/50">
              You&apos;ll pay securely with Stripe on the next step. Shipping
              address and payment details are collected there.
            </p>

            {error && (
              <div className="border border-terra/30 bg-terra/5 px-4 py-3 text-sm text-terra">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-ink py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra disabled:opacity-60"
            >
              {busy ? "Contacting payments…" : "Continue to Payment"}
            </button>
            <p className="text-center text-xs text-ink/40">
              Test mode — no real charges. Try card 4242 4242 4242 4242.
            </p>
          </form>
        </div>

        <aside className="h-fit border border-ink/10 bg-white p-6">
          <h2 className="font-display font-condensed text-xl font-black uppercase tracking-tight">
            Order Summary
          </h2>
          <ul className="mt-4 space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4">
                <div className="h-16 w-12 shrink-0 overflow-hidden bg-sand/60">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-0.5 text-xs text-ink/50">
                      Qty {item.quantity}
                      {[item.size, item.color].filter(Boolean).length > 0 &&
                        ` · ${[item.size, item.color].filter(Boolean).join(" · ")}`}
                    </p>
                  </div>
                  <p className="text-sm tabular-nums">${item.lineTotal.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/50">Subtotal</dt>
              <dd className="tabular-nums">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/50">Shipping</dt>
              <dd className="tabular-nums">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/50">Tax (TN 8.25%)</dt>
              <dd className="tabular-nums">${tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">${total.toFixed(2)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}