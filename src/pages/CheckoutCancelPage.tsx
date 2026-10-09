import { Link } from "react-router-dom";

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
      <p className="font-display font-condensed text-4xl font-black uppercase tracking-tight">
        Checkout cancelled
      </p>
      <p className="max-w-sm text-sm text-ink/50">
        Nothing was charged. Your bag is safe — come back any time.
      </p>
      <Link
        to="/checkout"
        className="mt-2 bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
      >
        Try Again
      </Link>
      <Link to="/" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40 hover:text-terra">
        Back to Shop
      </Link>
    </div>
  );
}