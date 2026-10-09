import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BagIcon } from "../components/icons";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register({ email, password, firstName, lastName });
      navigate("/account");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-cream px-5 py-24 sm:px-8">
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center justify-center gap-2 text-ink transition-colors hover:text-terra">
          <BagIcon className="h-4 w-4" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em]">
            Back to shop
          </span>
        </a>
        <h1 className="font-display font-condensed mt-6 text-center text-4xl font-black uppercase tracking-tight">
          Join Maison Cleo
        </h1>
        <p className="mt-2 text-center text-sm text-ink/50">
          Create an account to sync your bag and track orders.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 w-full border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
                placeholder="Cleo"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 w-full border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
                placeholder="Martin"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
              placeholder="8+ characters"
            />
          </div>

          {error && <p className="text-sm text-terra">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra disabled:opacity-60"
          >
            {busy ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/50">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-ink underline decoration-terra decoration-2 underline-offset-4 hover:text-terra">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}