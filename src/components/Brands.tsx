import { motion } from "framer-motion";
import { BRANDS } from "../data/site";

export default function Brands() {
  return (
    <section id="brands" className="scroll-mt-24 border-b border-ink/5 bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="flex items-center gap-6">
          <span className="h-px flex-1 bg-ink/10" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="px-2 text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-ink/50">
              The Brands We Carry
            </h2>
          </motion.div>
          <span className="h-px flex-1 bg-ink/10" />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {BRANDS.map((brand, i) => (
            <motion.span
              key={brand}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="font-display font-condensed cursor-pointer text-xl font-bold uppercase tracking-tight text-ink/55 transition-colors hover:text-terra sm:text-2xl"
            >
              {brand}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}