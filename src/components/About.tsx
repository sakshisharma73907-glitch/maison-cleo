import { motion } from "framer-motion";
import { ABOUT_IMAGE, ADDRESS } from "../data/site";
import { PinIcon, PhoneIcon } from "./icons";

export default function About() {
  return (
    <section className="bg-sand py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.3em] text-terra">
            Our Story
          </p>
          <h2 className="font-display font-condensed mt-3 max-w-lg text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
            A Boutique Built on Intuition
          </h2>

          <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-ink/65">
            <p>
              Maison Cleo began in 2018 with a single rack of secondhand silk and
              a conviction: that dressing well shouldn't feel like a chore. Five
              seasons later, we're still editing — a tightly curated mix of
              emerging designers and the houses you already love, chosen for
              fabric, fit, and how they make you feel.
            </p>
            <p>
              Walk into our East Nashville townhouse and you'll find warm lighting,
              low music, and no pressure. Just good clothes, honest advice, and a
              rack of pieces that will still be in rotation a decade from now.
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-5 border-t border-ink/10 pt-7 text-sm sm:flex-row sm:gap-14">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/50">
                <PinIcon className="h-4 w-4 text-terra" />
                Visit Us
              </p>
              <address className="mt-2 not-italic leading-relaxed text-ink/70">
                {ADDRESS.lines[0]}
                <br />
                {ADDRESS.lines[1]}
              </address>
            </div>
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/50">
                <PhoneIcon className="h-4 w-4 text-terra" />
                Hours & Contact
              </p>
              <p className="mt-2 leading-relaxed text-ink/70">
                {ADDRESS.hours[0]}
                <br />
                {ADDRESS.hours[1]}
              </p>
              <a
                href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                className="mt-1 inline-block text-terra transition-colors hover:text-ink"
              >
                {ADDRESS.phone}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Boutique interior photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={ABOUT_IMAGE}
              alt="The Maison Cleo boutique interior in Nashville"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden bg-cream px-7 py-5 shadow-[0_20px_50px_-20px_rgba(10,10,10,0.25)] sm:block">
            <p className="font-display font-condensed text-3xl font-black uppercase tracking-tight text-terra">
              2018
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/50">
              Est. in East Nashville
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}