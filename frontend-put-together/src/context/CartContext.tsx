import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { PublicCourseCard } from "../types/course";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type CartItem = {
  courseId: string;
  title: string;
  price: number | null;
  level: string;
  courseThumbnailUrl: string | null;
};

type CartContextType = {
  items: CartItem[];
  /** Returns true if the course is already in cart */
  isInCart: (courseId: string) => boolean;
  /**
   * If authenticated → adds to cart.
   * If NOT authenticated → redirects to /login.
   */
  addToCart: (course: PublicCourseCard) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  totalCount: number;
};

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([]);

  const isInCart = useCallback(
    (courseId: string) => items.some((i) => i.courseId === courseId),
    [items]
  );

  const addToCart = useCallback(
    (course: PublicCourseCard) => {
      if (!isAuthenticated) {
        // Redirect unauthenticated users to login
        navigate("/login", { state: { from: "/alle-kurse" } });
        return;
      }

      setItems((prev) => {
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
    setItems((prev) => prev.filter((i) => i.courseId !== courseId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{
        items,
        isInCart,
        addToCart,
        removeFromCart,
        clearCart,
        totalCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}