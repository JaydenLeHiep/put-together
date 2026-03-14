import { useContext } from "react";
import { CartContext, type CartContextType } from "./cartContext.type";

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}