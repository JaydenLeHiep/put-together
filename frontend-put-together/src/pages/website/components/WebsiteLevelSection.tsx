import { useState } from "react";
import { LEVELS } from "./Constants";
import { Reveal } from "../components/Hooks";

export default function WebsiteLevelSection() {
  const [active, setActive] = useState(0);
  const level = LEVELS[active];

  return (
    <section id="niveaus" className="bg-[#FCFBF8] py-24 px-8">
      <div className="mx-auto max-w-[1280px]">

        {/* Header */}
        <Reveal>
          <div className="mb-14">
            <div className="text-[12px] uppercase tracking-[0.22em] text-[#8a8070] font-semibold mb-4">
              Lorem Ipsum
            </div>

            <h2
              className="text-[#1a2744] leading-[1.2]"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(30px, 3vw, 44px)",
                fontWeight: 700,
              }}
            >
              Lorem ipsum dolor sit amet consectetur.
            </h2>
          </div>
        </Reveal>

        {/* Tab layout */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-0.5 items-stretch min-h-[400px]">

          {/* Tab buttons */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
            {LEVELS.map((l, i) => (
              <button
                key={l.code}
                onClick={() => setActive(i)}
                className={[
                  "flex items-center gap-4 px-7 py-6 cursor-pointer border-none text-left",
                  "transition-all duration-200 shrink-0",
                  "mb-0.5",
                  active === i
                    ? "bg-[#1a2744] border-l-4 border-[#e8c84a]"
                    : "bg-[#f0ede6] border-l-4 border-transparent hover:bg-[#e8e4dc]",
                ].join(" ")}
              >
                <span
                  className={`leading-none min-w-[44px] transition-colors duration-200 ${
                    active === i
                      ? "text-[#e8c84a]"
                      : "text-[#1a2744]"
                  }`}
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {l.code}
                </span>

                <span
                  className={`text-[14px] font-semibold tracking-[0.02em] transition-colors duration-200 ${
                    active === i
                      ? "text-white/80"
                      : "text-[#5a5248]"
                  }`}
                >
                  {l.title}
                </span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="bg-[#1a2744] p-14 flex flex-col justify-center">

            <div className="text-white/40 text-[12px] uppercase tracking-[0.2em] font-semibold mb-2">
              Lorem Ipsum
            </div>

            <div
              className="text-[#e8c84a] leading-none mb-6"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 80,
                fontWeight: 700,
              }}
            >
              {level.code}
            </div>

            <h3
              className="text-white mb-5"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {level.title}
            </h3>

            <p className="text-white/65 text-[17px] leading-[1.8] mb-10 max-w-[480px]">
              {level.desc}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-10">

              <div>
                <div className="text-white/40 text-[12px] uppercase tracking-[0.14em] mb-1.5">
                  Lorem
                </div>

                <div className="text-white text-[22px] font-bold">
                  {level.weeks} Ipsum
                </div>
              </div>

              <div className="w-px h-12 bg-white/15" />

              <div>
                <div className="text-white/40 text-[12px] uppercase tracking-[0.14em] mb-1.5">
                  Dolor
                </div>

                <div className="text-white text-[22px] font-bold">
                  {level.weeks * 4}+ Sit
                </div>
              </div>

              <a
                href="#kontakt"
                className="ml-auto inline-block bg-[#e8c84a] text-[#1a2744]
                           text-[14px] font-bold px-7 py-3.5
                           tracking-[0.04em] no-underline shrink-0
                           hover:bg-[#f0d45a]
                           transition-colors duration-200"
              >
                Lorem Ipsum
              </a>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}