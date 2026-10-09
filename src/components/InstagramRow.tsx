import { motion } from "framer-motion";
import { INSTAGRAM } from "../data/site";
import { InstagramIcon } from "./icons";

export default function InstagramRow() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="mb-10 text-center">
          <p className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase leading-none tracking-[0.3em] text-terra">
            <InstagramIcon className="h-4 w-4" />
            @maisoncleo.nash
          </p>
          <h2 className="font-display font-condensed mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Shop the Feed
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {INSTAGRAM.map((post, i) => (
            <motion.a
              key={post.image}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-500 group-hover:bg-ink/35 group-hover:opacity-100">
                <InstagramIcon className="h-7 w-7 text-cream" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}