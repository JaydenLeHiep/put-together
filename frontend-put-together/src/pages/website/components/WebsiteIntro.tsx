import { useEffect, useRef, useState } from "react";
import { ACCREDITATIONS } from "./Constants";

function useFadeIn(direction: "left" | "right" = "left", delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateX(0)"
      : direction === "left"
      ? "translateX(-32px)"
      : "translateX(32px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  };

  return { ref, style };
}

export default function WebsiteIntro() {
  const left = useFadeIn("left", 0);
  const right = useFadeIn("right", 150);

  return (
    <section className="bg-[#FCFBF8] py-24 px-8">
      <div className="mx-auto max-w-[1280px] grid lg:grid-cols-2 gap-24 items-start">

        {/* Left */}
        <div ref={left.ref} style={left.style}>
          <div className="text-[12px] uppercase tracking-[0.22em] text-[#8a8070] font-semibold mb-5">
            Lorem Ipsum
          </div>

          <h2
            className="text-[#1a2744] leading-[1.2] mb-8"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(32px, 3.5vw, 48px)",
              fontWeight: 700,
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </h2>

          <div className="w-14 h-[3px] bg-[#e8c84a]" />
        </div>

        {/* Right */}
        <div ref={right.ref} style={right.style}>
          <p className="text-[#5a5248] text-[17px] leading-[1.85] mb-7">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>

          <p className="text-[#5a5248] text-[17px] leading-[1.85] mb-10">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>

          <div className="flex flex-wrap gap-3">
            {ACCREDITATIONS.map((badge) => (
              <div
                key={badge}
                className="border border-[#d4cfc4] px-4 py-2 text-[12px]
                           font-semibold text-[#1a2744]
                           tracking-[0.06em]"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}