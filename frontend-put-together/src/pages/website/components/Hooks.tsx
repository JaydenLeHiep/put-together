import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.reveal = "visible";
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -32px 0px",
      },
    );

    element.dataset.reveal = "pending";
    observer.observe(element);

    return () => {
      observer.disconnect();
      delete element.dataset.reveal;
    };
  }, []);

  const style = {
    "--reveal-delay": `${Math.min(Math.max(delay, 0), 300)}ms`,
    "--reveal-x":
      direction === "left"
        ? "-18px"
        : direction === "right"
          ? "18px"
          : "0px",
    "--reveal-y": direction === "up" ? "18px" : "0px",
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`website-reveal ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}