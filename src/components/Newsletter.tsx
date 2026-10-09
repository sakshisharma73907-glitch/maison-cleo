import { motion } from "framer-motion";
import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowIcon } from "./icons";

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="newsletter" className="scroll-mt-24 bg-sand">
      <div className="mx-auto max-w-[1400px] px-5 py-20 text-center sm:px-8 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.3em] text-terra">
            The Cleo List
          </p>
          <h2 className="font-display font-condensed mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Be the First to Know
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-ink/60">
            New arrivals, private sales, and styling notes — straight to your
            inbox, never more than once a week.
          </p>

          {submitted ? (
            <p className="mx-auto mt-9 inline-block border border-terra bg-cream px-8 py-4 text-sm text-ink">
              Welcome to the list — c<b className="text-terra">leo</b> us in.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-9 flex max-w-lg flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Your email address"
                className="h-13 flex-1 border border-ink/15 bg-cream px-5 text-sm outline-none transition-colors placeholder:text-ink/40 focus:border-terra"
              />
              <button
                type="submit"
                className="group inline-flex h-13 shrink-0 cursor-pointer items-center justify-center gap-3 bg-ink px-8 text-[12px] font-semibold uppercase tracking-[0.22em] text-cream transition-colors hover:bg-terra"
              >
                Subscribe
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}