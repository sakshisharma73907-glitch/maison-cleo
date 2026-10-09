import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NEW_ARRIVALS } from "../data/site";
import { useCatalog } from "../hooks/useCatalog";
import AddToCartButton from "./AddToCartButton";

export default function NewArrivals() {
  const { products } = useCatalog("isNew=true", NEW_ARRIVALS);

  return (
    <section id="new-arrivals" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.3em] text-terra">
              Just In
            </p>
            <h2 className="font-display font-condensed mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
              New Arrivals
            </h2>
          </div>
          <a
            href="#shop"
            className="group hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/60 transition-colors hover:text-ink sm:block"
          >
            Shop All
            <span className="ml-3 inline-block h-px w-8 bg-terra align-middle transition-all duration-300 group-hover:w-14" />
          </a>
        </div>
      </div>

      {/* Horizontally scrollable row — swipeable on mobile */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 sm:gap-6 sm:px-8 lg:px-[max(2rem,calc((100vw-1600px)/2+2rem))]">
        {products.map((product, i) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group w-[64vw] shrink-0 snap-start sm:w-[300px]"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Second photo revealed on hover */}
                <img
                  src={product.hover}
                  alt={`${product.name} alternate view`}
                  className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="absolute left-3 top-3 bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                  {product.tag}
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm tabular-nums">{`$${product.price}`}</p>
              </div>
            </Link>
            <AddToCartButton product={product} />
          </motion.article>
        ))}

        {/* End "view all" card */}
        <a
          href="#shop"
          className="group flex w-[46vw] shrink-0 snap-start flex-col items-center justify-center border border-ink/10 text-center transition-colors hover:border-terra sm:w-[300px]"
        >
          <span className="font-display font-condensed text-2xl font-black uppercase tracking-tight text-ink/70 transition-colors group-hover:text-terra">
            View All
          </span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            120+ pieces
          </span>
        </a>
      </div>
    </section>
  );
}