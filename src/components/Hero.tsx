import { motion } from "framer-motion";
import { COLLECTION, HERO_IMAGE } from "../data/site";
import { ArrowIcon } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section id="hero" className="relative h-[100svh] min-h-[560px] overflow-hidden">
      {/* Ken Burns zoom — 8s slow continuous pan/zoom */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.14, 1],
          x: ["0%", "1.5%", "0%"],
        }}
        transition={{
          duration: 8,
          ease: [0.4, 0, 0.2, 1],
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        <img
          src={HERO_IMAGE}
          alt="Maison Cleo fall campaign editorial"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Editorial tint + text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/20" />

      <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-24 text-center text-cream sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="text-[11px] font-semibold uppercase tracking-[0.45em] text-cream/80"
        >
          {COLLECTION} · Nashville
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease }}
          className="font-display font-condensed mt-5 max-w-5xl text-balance text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl"
        >
          Curated Style,
          <br />
          Effortlessly Yours
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease }}
        >
          <a
            href="#new-arrivals"
            className="group mt-9 inline-flex items-center gap-3 border border-cream/40 bg-terra px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-cream transition-colors duration-300 hover:bg-ink"
          >
            Shop New Arrivals
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="block h-9 w-px bg-cream/60"
        />
      </motion.div>
    </section>
  );
}