import { COLLECTION, ADDRESS } from "../data/site";
import { InstagramIcon, PinIcon, PhoneIcon } from "./icons";

const FOOTER_LINKS = [
  { heading: "Shop", links: ["New Arrivals", "Bestsellers", "Sale", "Gift Cards"] },
  { heading: "Company", links: ["Our Story", "Brands", "Journal", "Careers"] },
  { heading: "Help", links: ["Shipping & Returns", "Size Guide", "Contact Us", "FAQ"] },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-[1600px] px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Wordmark + blurb */}
          <div>
            <p className="font-display font-condensed text-3xl font-black uppercase tracking-tight">
              Maison Cleo
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.5em] text-cream/40">
              Nashville · Est. 2018
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/55">
              A curated women's boutique in East Nashville. Edited-down,
              beautifully-made clothing for every season of your life.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border border-cream/20 transition-colors hover:border-terra hover:text-terra"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="#newsletter"
                className="border border-cream/20 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-terra hover:text-terra"
              >
                Newsletter
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/40">
                {col.heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-cream/70 transition-colors hover:text-terra"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Contact strip + mobile cart anchor target kept accessible */}
        <div className="mt-14 flex flex-col gap-4 border-t border-cream/10 pt-8 text-sm text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <PinIcon className="h-4 w-4 text-terra" />
            {ADDRESS.lines[0]}, {ADDRESS.lines[1]}
          </p>
          <a
            href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
            className="flex items-center gap-2 transition-colors hover:text-terra"
          >
            <PhoneIcon className="h-4 w-4 text-terra" />
            {ADDRESS.phone}
          </a>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-[11px] uppercase tracking-[0.2em] text-cream/30 sm:flex-row">
          <p>© {new Date().getFullYear()} Maison Cleo, Nashville. All rights reserved.</p>
          <p className="hidden sm:block">{COLLECTION}</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-terra">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-terra">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}