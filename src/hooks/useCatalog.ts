import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { CatalogProduct } from "../lib/types";
import type { Product } from "../data/site";

function toCardProduct(p: CatalogProduct): Product {
  return {
    id: p.slug,
    name: p.name,
    price: p.price,
    tag: p.tag,
    image: p.image,
    hover: p.hover ?? p.image,
  };
}

export function useCatalog(
  query: string,
  fallback: Product[],
): { products: Product[]; fromServer: boolean; loading: boolean } {
  const [state, setState] = useState<{
    products: Product[];
    fromServer: boolean;
    loading: boolean;
  }>({ products: fallback, fromServer: false, loading: true });

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ products: CatalogProduct[] }>(`/products?${query}&limit=10`)
      .then((res) => {
        if (cancelled) return;
        const server = res.data.products;
        setState({
          products:
            server.length > 0 ? server.map(toCardProduct) : fallback,
          fromServer: server.length > 0,
          loading: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ products: fallback, fromServer: false, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [query, fallback]);

  return state;
}