import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { BagIcon } from "./icons";

export default function MobileCartFab() {
  const { count, setOpen } = useCart();

  return (
    <motion.button
      type="button"
      onClick={() => setOpen(true)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream shadow-[0_16px_40px_-12px_rgba(10,10,10,0.5)] transition-colors hover:bg-terra lg:hidden"
      aria-label="Open cart"
    >
      <BagIcon className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terra text-[10px] font-semibold text-cream tabular-nums">
          {count > 99 ? "99" : count}
        </span>
      )}
    </motion.button>
  );
}