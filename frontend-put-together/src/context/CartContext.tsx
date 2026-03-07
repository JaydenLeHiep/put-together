import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { PublicCourseCard } from "../types/course";

export type CartItem = {
  courseId: string;
  title: string;
  price: number | null;
  level: string;
  courseThumbnailUrl: string | null;
};

type CartContextType = {
  items: CartItem[];
  isInCart: (courseId: string) => boolean;
  addToCart: (course: PublicCourseCard) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  totalCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
    }
  }, [isAuthenticated]);

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

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}