import { motion } from "framer-motion";
import { LOOKS } from "../data/site";
import { ArrowIcon } from "./icons";

export default function Lookbook() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.3em] text-terra">
            The Lookbook
          </p>
          <h2 className="font-display font-condensed mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Three Ways to Wear It
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-20 sm:gap-28">
        {LOOKS.map((look, i) => {
          const flipped = i % 2 === 1;
          return (
            <div
              key={look.id}
              className="mx-auto grid w-full max-w-[1400px] items-center gap-8 px-5 sm:gap-12 sm:px-8 lg:grid-cols-2"
            >
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={`overflow-hidden lg:order-none ${flipped ? "lg:order-2" : ""}`}
              >
                <div className="aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[4/5]">
                  <img
                    src={look.image}
                    alt={look.name}
                    className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                  />
                </div>
              </motion.div>

              {/* Copy */}
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`lg:order-none ${flipped ? "lg:order-1 lg:text-right" : ""}`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/40">
                  {look.tagline}
                </p>
                <h3 className="font-display font-condensed mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                  {look.name}
                </h3>
                <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-ink/60">
                  {look.blurb}
                </p>

                <div
                  className={`mt-7 flex flex-col gap-2.5 text-sm text-ink/70 ${
                    flipped ? "lg:items-end" : ""
                  }`}
                >
                  {look.pieces.map((piece) => (
                    <a
                      key={piece}
                      href="#new-arrivals"
                      className="group inline-flex items-center gap-3"
                    >
                      <span className="border-b border-ink/15 pb-0.5 transition-colors group-hover:border-terra group-hover:text-terra">
                        {piece}
                      </span>
                      <ArrowIcon className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
                <span className="mt-4 inline-block border-b border-terra pb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-terra">
                  Shop This Look
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}