import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api, apiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { Order } from "../lib/types";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    api
      .get<{ orders: Order[] }>("/orders")
      .then((res) => setOrders(res.data.orders))
      .catch((e) => setOrdersError(apiErrorMessage(e)));
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-cream">
        <p className="text-sm uppercase tracking-[0.3em] text-ink/40">Loading…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-5xl bg-cream px-5 py-28 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-terra">
        My Account
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display font-condensed text-4xl font-black uppercase tracking-tight sm:text-5xl">
          {user.firstName || user.email.split("@")[0]}
        </h1>
        <button
          type="button"
          onClick={() => void logout()}
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40 transition-colors hover:text-terra"
        >
          Sign out
        </button>
      </div>
      <p className="mt-2 text-sm text-ink/50">{user.email}</p>

      {user.role === "admin" && (
        <Link
          to="/admin"
          className="mt-6 inline-block bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
        >
          Open Admin Panel
        </Link>
      )}

      <section className="mt-12">
        <h2 className="font-display font-condensed text-2xl font-black uppercase tracking-tight">
          Order History
        </h2>
        {ordersError && <p className="mt-3 text-sm text-terra">{ordersError}</p>}
        {!ordersError && orders.length === 0 && (
          <p className="mt-4 text-sm text-ink/50">
            No orders yet.{" "}
            <Link to="/" className="font-semibold underline decoration-terra decoration-2 underline-offset-4 hover:text-terra">
              Start shopping
            </Link>
          </p>
        )}
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 border border-ink/10 px-5 py-4"
            >
              <div>
                <p className="text-sm font-semibold tabular-nums">
                  {order.orderNumber}
                </p>
                <p className="mt-0.5 text-xs text-ink/50">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-ink/60">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
              <p className="text-sm font-semibold tabular-nums">
                ${order.total.toFixed(2)}
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    order.payment.status === "Paid"
                      ? "bg-sand text-ink"
                      : "bg-ink/10 text-ink/60"
                  }`}
                >
                  {order.payment.status}
                </span>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/60">
                  {order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}