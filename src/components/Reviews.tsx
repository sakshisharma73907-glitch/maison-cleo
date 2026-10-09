import { motion } from "framer-motion";
import { REVIEWS } from "../data/site";
import { StarIcon } from "./icons";

export default function Reviews() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.3em] text-terra">
            Kind Words
          </p>
          <h2 className="font-display font-condensed mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.figure
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col border border-ink/10 bg-cream p-8"
            >
              <div className="flex gap-1 text-terra">
                {Array.from({ length: 5 }).map((_, s) => (
                  <StarIcon key={s} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-ink/70">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-7">
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
                  {review.origin}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}