import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BESTSELLERS } from "../data/site";
import { useCatalog } from "../hooks/useCatalog";
import AddToCartButton from "./AddToCartButton";

export default function Bestsellers() {
  const { products } = useCatalog("isBestseller=true", BESTSELLERS);

  return (
    <section id="sale" className="scroll-mt-24 bg-cream pb-20 sm:pb-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.3em] text-terra">
            Loved Most
          </p>
          <h2 className="font-display font-condensed mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            The Bestsellers
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <img
                    src={product.hover}
                    alt={`${product.name} alternate view`}
                    className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  {/* Terracotta bestseller badge */}
                  <span className="absolute left-3 top-3 bg-terra px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream">
                    Bestseller
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-medium sm:text-sm">{product.name}</h3>
                  <p className="text-[13px] tabular-nums sm:text-sm">{`$${product.price}`}</p>
                </div>
              </Link>
              <AddToCartButton product={product} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}