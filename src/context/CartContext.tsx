import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  getCartToken,
  readLocalCart,
  writeLocalCart,
} from "../lib/cartToken";
import type { CartItem, CartPayload } from "../lib/types";
import { useAuth } from "./AuthContext";

type AddInput = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  size?: string;
  color?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen(open: boolean): void;
  loading: boolean;
  serverMode: boolean;
  add(input: AddInput): Promise<void>;
  updateQty(productId: string, quantity: number): Promise<void>;
  remove(productId: string): Promise<void>;
  clear(): Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

function localEmpty(): CartPayload {
  return { items: [], count: 0, subtotal: 0 };
}

function recalc(items: CartItem[]): CartPayload {
  const priced = items.map((it) => ({
    ...it,
    lineTotal: it.price * it.quantity,
  }));
  const count = priced.reduce((a, i) => a + i.quantity, 0);
  const subtotal = priced.reduce((a, i) => a + i.lineTotal, 0);
  return { items: priced, count, subtotal };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [serverMode, setServerMode] = useState(true);
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  function apply(payload: CartPayload) {
    setItems(payload.items);
    setCount(payload.count);
    setSubtotal(payload.subtotal);
  }

  async function refresh() {
    try {
      const res = await api.get<CartPayload>("/cart", {
        headers: { "X-Cart-Token": getCartToken() },
      });
      setServerMode(true);
      apply(res.data);
    } catch {
      setServerMode(false);
      const local = readLocalCart<CartPayload>();
      apply(local ?? localEmpty());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function add(input: AddInput) {
    if (serverMode) {
      try {
        const res = await api.post<CartPayload>(
          "/cart/add",
          {
            productId: input.productId,
            quantity: input.quantity ?? 1,
            size: input.size,
            color: input.color,
          },
          { headers: { "X-Cart-Token": getCartToken() } },
        );
        apply(res.data);
        return;
      } catch {
        // fall through to local cart
      }
    }

    const existing = items.find(
      (i) =>
        i.productId === input.productId &&
        (i.size ?? "") === (input.size ?? "") &&
        (i.color ?? "") === (input.color ?? ""),
    );
    const next = recalc(
      existing
        ? items.map((i) =>
            i === existing
              ? { ...i, quantity: i.quantity + (input.quantity ?? 1) }
              : i,
          )
        : [
            ...items,
            {
              productId: input.productId,
              name: input.name,
              price: input.price,
              image: input.image,
              quantity: input.quantity ?? 1,
              size: input.size,
              color: input.color,
              lineTotal: input.price * (input.quantity ?? 1),
            },
          ],
    );
    apply(next);
    writeLocalCart(next);
  }

  async function updateQty(productId: string, quantity: number) {
    if (serverMode) {
      try {
        const res = await api.put<CartPayload>(
          "/cart/update",
          { productId, quantity },
          { headers: { "X-Cart-Token": getCartToken() } },
        );
        apply(res.data);
        return;
      } catch {
        // fall through
      }
    }
    const next = recalc(
      quantity === 0
        ? items.filter((i) => i.productId !== productId)
        : items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
    apply(next);
    writeLocalCart(next);
  }

  async function remove(productId: string) {
    if (serverMode) {
      try {
        const res = await api.delete<CartPayload>(`/cart/remove/${productId}`, {
          headers: { "X-Cart-Token": getCartToken() },
        });
        apply(res.data);
        return;
      } catch {
        // fall through
      }
    }
    const next = recalc(items.filter((i) => i.productId !== productId));
    apply(next);
    writeLocalCart(next);
  }

  async function clear() {
    if (serverMode) {
      try {
        await api.delete("/cart", {
          headers: { "X-Cart-Token": getCartToken() },
        });
      } catch {
        // ignore
      }
    }
    apply(localEmpty());
    writeLocalCart(localEmpty());
  }

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        open,
        setOpen,
        loading,
        serverMode,
        add,
        updateQty,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}