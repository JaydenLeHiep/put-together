import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { PublicCourseCard } from "../types/course";
import { CartContext, type CartContextType, type CartItem } from "./cartContext.type";

export default function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [rawItems, setRawItems] = useState<CartItem[]>([]);

  // If not authenticated, behave like cart is empty (no effect needed)
  const items = useMemo(
    () => (isAuthenticated ? rawItems : []),
    [isAuthenticated, rawItems]
  );

  const isInCart = useCallback(
    (courseId: string) => items.some((i) => i.courseId === courseId),
    [items]
  );

  const addToCart = useCallback(
    (course: PublicCourseCard) => {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: "/alle-kurse" } });
        return;
      }

      setRawItems((prev) => {
        if (prev.some((i) => i.courseId === course.id)) return prev;

        return [
          ...prev,
          {
            courseId: course.id,
            title: course.title,
            price: course.price,
            level: course.level,
            courseThumbnailUrl: course.courseThumbnailUrl,
          },
        ];
      });
    },
    [isAuthenticated, navigate]
  );

  const removeFromCart = useCallback((courseId: string) => {
    setRawItems((prev) => prev.filter((i) => i.courseId !== courseId));
  }, []);

  const clearCart = useCallback(() => setRawItems([]), []);

  const value: CartContextType = useMemo(
    () => ({
      items,
      isInCart,
      addToCart,
      removeFromCart,
      clearCart,
      totalCount: items.length,
    }),
    [items, isInCart, addToCart, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}