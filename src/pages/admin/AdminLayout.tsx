import { NavLink, Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const tabs = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products", end: false },
  { to: "/admin/orders", label: "Orders", end: false },
];

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-cream">
        <p className="text-sm uppercase tracking-[0.3em] text-ink/40">Loading…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="min-h-[100svh] bg-cream">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-terra">
              Admin
            </p>
            <p className="font-display font-condensed text-2xl font-black uppercase tracking-tight">
              Maison Cleo Store Manager
            </p>
          </div>
          <Link
            to="/"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-terra"
          >
            View Store →
          </Link>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 px-5 pb-0 sm:px-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `border-b-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? "border-terra text-ink"
                    : "border-transparent text-ink/40 hover:text-ink"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}