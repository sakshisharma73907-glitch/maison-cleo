import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { COLLECTION, NAV } from "../data/site";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  PersonIcon,
  SearchIcon,
} from "./icons";

function Wordmark() {
  return (
    <a href="#top" className="flex flex-col items-center leading-none">
      <span className="font-display font-condensed text-[26px] font-extrabold tracking-tight uppercase">
        Maison Cleo
      </span>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.5em] text-ink/50">
        Nashville
      </span>
    </a>
  );
}

function ActionButtons() {
  const { count, setOpen } = useCart();
  const { user, loading } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label="Search"
        className="transition-colors hover:text-terra"
      >
        <SearchIcon className="h-[18px] w-[18px]" />
      </button>
      <Link
        to={user ? "/account" : "/login"}
        aria-label="Account"
        className="transition-colors hover:text-terra"
      >
        <PersonIcon className="h-[18px] w-[18px]" />
      </Link>
      <button
        type="button"
        aria-label="Wishlist"
        className="hidden transition-colors hover:text-terra sm:block"
      >
        <HeartIcon className="h-[18px] w-[18px]" />
      </button>
      <button
        type="button"
        aria-label="Cart"
        onClick={() => setOpen(true)}
        className="relative transition-colors hover:text-terra"
      >
        <BagIcon className="h-[18px] w-[18px]" />
        {!loading && count > 0 && (
          <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-terra text-[9px] font-semibold text-cream tabular-nums">
            {count > 99 ? "99" : count}
          </span>
        )}
      </button>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col bg-cream"
        >
          <div className="flex items-center justify-between px-6 py-5">
            <Wordmark />
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="transition-colors hover:text-terra"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <motion.nav
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="flex flex-1 flex-col justify-center gap-2 px-6"
          >
            {[...NAV, { label: COLLECTION, href: "#hero" }].map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={onClose}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 },
                }}
                className="font-display font-condensed border-b border-ink/10 py-4 text-4xl font-extrabold uppercase tracking-tight transition-colors hover:text-terra"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>

          <div className="px-6 pb-10 text-center text-sm text-ink/50">
            <p>1112 Eastland Avenue · Nashville, TN 37206</p>
            <p className="mt-1">Tue–Sat 10–6 · Sun 11–4</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-ink/5 bg-cream/85 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="grid grid-cols-3 items-center px-5 py-4 sm:px-8">
          {/* Left — nav (desktop) / hamburger (mobile) */}
          <div className="justify-self-start">
            <nav className="hidden items-center gap-7 lg:flex">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="transition-colors hover:text-terra lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Center — wordmark */}
          <div className="justify-self-center">
            <Wordmark />
          </div>

          {/* Right — actions */}
          <div className="justify-self-end">
            <ActionButtons />
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}