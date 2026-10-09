import { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import type { Metrics } from "../../lib/types";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Metrics>("/admin/metrics")
      .then((res) => setMetrics(res.data))
      .catch((e) => setError(apiErrorMessage(e)));
  }, []);

  if (error) return <p className="text-sm text-terra">{error}</p>;
  if (!metrics) {
    return <p className="text-sm uppercase tracking-[0.3em] text-ink/40">Loading…</p>;
  }

  const cards = [
    { label: "Total revenue", value: `$${metrics.totalRevenue.toFixed(2)}` },
    { label: "Orders (all time)", value: String(metrics.ordersCount) },
    { label: "This month revenue", value: `$${metrics.monthlyRevenue.toFixed(2)}` },
    { label: "This month orders", value: String(metrics.monthlyOrders) },
    { label: "Customers", value: String(metrics.usersCount) },
    { label: "Low stock items", value: String(metrics.lowStock.length) },
  ];

  return (
    <div>
      <h1 className="font-display font-condensed text-3xl font-black uppercase tracking-tight">
        Dashboard
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="border border-ink/10 bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">
              {c.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display font-condensed text-xl font-black uppercase tracking-tight">
            Low Stock
          </h2>
          {metrics.lowStock.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">All good — nothing running low.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/5 border border-ink/10 bg-white">
              {metrics.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm">{p.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                      p.stock === 0 ? "bg-terra/15 text-terra" : "bg-sand text-ink"
                    }`}
                  >
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-display font-condensed text-xl font-black uppercase tracking-tight">
            Recent Orders
          </h2>
          <ul className="mt-4 divide-y divide-ink/5 border border-ink/10 bg-white">
            {metrics.recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold tabular-nums">{o.orderNumber}</p>
                  <p className="text-xs text-ink/50">{o.customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    ${o.total.toFixed(2)}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-ink/40">
                    {o.status} · {o.payment.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}