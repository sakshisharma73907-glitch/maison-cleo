import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, apiErrorMessage } from "../lib/api";
import { useCart } from "../context/CartContext";
import type { Order } from "../lib/types";

export default function CheckoutSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") ?? "";
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { clear } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session reference.");
      return;
    }
    let attempts = 0;
    let active = true;
    const poll = () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      api
        .get<{ order: Order }>(`/orders/session/${sessionId}`)
        .then((res) => {
          if (!active) return;
          setOrder(res.data.order);
          void clear();
        })
        .catch(async (e) => {
          if (!active) return;
          attempts += 1;
          const msg = apiErrorMessage(e);
          if (attempts < 8 && msg.includes("not")) {
            setTimeout(poll, 1500);
          } else {
            setError(msg);
          }
        });
    };
    poll();
    return () => {
      active = false;
    };
  }, [sessionId, clear]);

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-cream px-5 py-24 sm:px-8">
      <div className="w-full max-w-lg text-center">
        {error ? (
          <>
            <p className="font-display font-condensed text-4xl font-black uppercase tracking-tight">
              Checking your order…
            </p>
            <p className="mt-3 text-sm text-ink/50">{error}</p>
          </>
        ) : !order ? (
          <p className="text-sm uppercase tracking-[0.3em] text-ink/40">
            Confirming payment…
          </p>
        ) : (
          <>
            <p className="text-6xl">✓</p>
            <h1 className="font-display font-condensed mt-4 text-4xl font-black uppercase tracking-tight">
              Thank You
            </h1>
            <p className="mt-3 text-sm text-ink/50">
              Your order <span className="font-semibold text-ink tabular-nums">{order.orderNumber}</span> is
              confirmed. A confirmation is on its way.
            </p>
            <div className="mx-auto mt-8 max-w-sm border border-ink/10 bg-white p-5 text-left">
              <ul className="space-y-3 text-sm">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-start justify-between gap-3">
                    <span className="text-ink/70">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="text-ink/40"> × {item.quantity}</span>
                      )}
                    </span>
                    <span className="tabular-nums">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-ink/10 pt-3 text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">${order.total.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-6 text-xs text-ink/40">
              {order.status} · {order.payment.status}
            </p>
            <Link
              to="/account"
              className="mt-8 inline-block bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
            >
              View in Account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}