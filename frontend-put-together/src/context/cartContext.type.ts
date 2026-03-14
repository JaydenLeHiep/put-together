import { createContext } from "react";
import type { PublicCourseCard } from "../types/course";

export type CartItem = {
  courseId: string;
  title: string;
  price: number | null;
  level: string;
  courseThumbnailUrl: string | null;
};

export type CartContextType = {
  items: CartItem[];
  isInCart: (courseId: string) => boolean;
  addToCart: (course: PublicCourseCard) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  totalCount: number;
};

export const CartContext = createContext<CartContextType | null>(null);