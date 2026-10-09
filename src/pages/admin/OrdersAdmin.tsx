import { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import type { Order } from "../../lib/types";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered"] as const;

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  function load(silent = false) {
    if (!silent) setError(null);
    api
      .get<{ orders: Order[] }>("/admin/orders?limit=100")
      .then((res) => setOrders(res.data.orders))
      .catch((e) => setError(apiErrorMessage(e)));
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(orderId: string, status: Order["status"]) {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      load(true);
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  }

  async function setTracking(orderId: string, value: string) {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, {
        status: orders.find((o) => o.id === orderId)?.status,
        trackingNumber: value,
      });
      load(true);
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  }

  return (
    <div>
      <h1 className="font-display font-condensed text-3xl font-black uppercase tracking-tight">
        Orders
      </h1>

      {error && (
        <p className="mt-4 border border-terra/30 bg-terra/5 px-4 py-3 text-sm text-terra">
          {error}
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {orders.map((order) => {
          const isOpen = expanded === order.id;
          return (
            <li key={order.id} className="border border-ink/10 bg-white">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : order.id)}
                className="grid w-full gap-3 px-5 py-4 text-left sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
              >
                <div>
                  <p className="text-sm font-semibold tabular-nums">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-ink/50">{order.customer.email}</p>
                </div>
                <p className="text-xs text-ink/50">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm font-semibold tabular-nums">
                  ${order.total.toFixed(2)}
                </p>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    order.payment.status === "Paid"
                      ? "bg-ink text-cream"
                      : "bg-sand text-ink"
                  }`}
                >
                  {order.payment.status}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-ink/10 px-5 py-4">
                  <ul className="space-y-2 text-sm">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex items-start justify-between gap-3">
                        <span className="text-ink/70">
                          {item.name}
                          {[item.size, item.color].filter(Boolean).length > 0 &&
                            ` (${[item.size, item.color].filter(Boolean).join(" · ")})`}
                          <span className="text-ink/40"> × {item.quantity}</span>
                        </span>
                        <span className="tabular-nums">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-4 max-w-sm space-y-1.5 border-t border-ink/10 pt-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink/50">Subtotal</dt>
                      <dd className="tabular-nums">${order.subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink/50">Shipping</dt>
                      <dd className="tabular-nums">${order.shipping.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink/50">Tax</dt>
                      <dd className="tabular-nums">${order.tax.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <dt>Total</dt>
                      <dd className="tabular-nums">${order.total.toFixed(2)}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                        Status
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          void setStatus(order.id, e.target.value as Order["status"])
                        }
                        className="border border-ink/15 bg-cream px-3 py-2 text-sm outline-none focus:border-ink"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    {order.trackingNumber && (
                      <span className="text-xs text-ink/50">
                        Tracking: {order.trackingNumber}
                      </span>
                    )}
                    <label className="flex items-center gap-2 text-sm">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                        Tracking #
                      </span>
                      <input
                        defaultValue={order.trackingNumber ?? ""}
                        onBlur={(e) => void setTracking(order.id, e.target.value)}
                        placeholder="UPS/Tracking number"
                        className="border border-ink/15 bg-cream px-3 py-2 text-sm outline-none focus:border-ink"
                      />
                    </label>
                  </div>
                </div>
              )}
            </li>
          );
        })}
        {orders.length === 0 && (
          <li className="border border-dashed border-ink/15 px-5 py-10 text-center text-sm text-ink/50">
            No orders yet.
          </li>
        )}
      </ul>
    </div>
  );
}