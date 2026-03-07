import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  courseId: string;
  title: string;
  price: number | null;
  thumbnailUrl?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (item: CartItem) => void;
  remove: (courseId: string) => void;
  clear: () => void;
  has: (courseId: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lila_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const has = (courseId: string) => items.some((x) => x.courseId === courseId);

    const add = (item: CartItem) => {
      setItems((prev) => {
        if (prev.some((x) => x.courseId === item.courseId)) return prev;
        return [...prev, item];
      });
    };

    const remove = (courseId: string) => {
      setItems((prev) => prev.filter((x) => x.courseId !== courseId));
    };

    const clear = () => setItems([]);

    return { items, count: items.length, add, remove, clear, has };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}