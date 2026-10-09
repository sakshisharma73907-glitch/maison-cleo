import { motion } from "framer-motion";
import { CATEGORIES } from "../data/site";

export default function Categories() {
  return (
    <section id="shop" className="scroll-mt-24 bg-cream">
      <div className="grid lg:grid-cols-3">
        {CATEGORIES.map((category, i) => (
          <motion.a
            key={category.name}
            href="#new-arrivals"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: i * 0.12 }}
            className="group relative block h-[70vh] overflow-hidden lg:h-[92vh]"
          >
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            {/* Full-bleed overlay + white Shop label */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/5 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-10 text-center text-cream">
              <h3 className="font-display font-condensed text-3xl font-black uppercase tracking-tight sm:text-4xl">
                {category.name}
              </h3>
              <p className="max-w-[26ch] text-[12px] leading-relaxed text-cream/75">
                {category.sub}
              </p>
              <span className="mt-3 border border-cream/60 bg-cream px-10 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink transition-colors duration-300 group-hover:bg-terra group-hover:text-cream group-hover:border-terra">
                Shop
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}