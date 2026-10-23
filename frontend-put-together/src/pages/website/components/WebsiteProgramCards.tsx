import { useState } from "react";
import { PROGRAMS, type Program } from "./Constants";
import { Reveal } from "../components/Hooks";

function ProgramCard({ program, delay }: { program: Program; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={delay}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={[
          "flex flex-col h-full p-10 cursor-pointer border-t-[3px] transition-colors duration-250",
          hovered
            ? "bg-[#1a2744] border-t-[#e8c84a]"
            : "bg-[#FCFBF8] border-t-[#1a2744]",
        ].join(" ")}
      >
        <div className="text-[32px] mb-5">{program.icon}</div>

        <div
          className={`text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 transition-colors duration-250 ${
            hovered ? "text-[#e8c84a]" : "text-[#8a8070]"
          }`}
        >
          {program.tag}
        </div>

        <h3
          className={`text-[22px] font-bold leading-[1.25] mb-4 transition-colors duration-250 ${
            hovered ? "text-white" : "text-[#1a2744]"
          }`}
          style={{ fontFamily: "Georgia, serif" }}
        >
          {program.title}
        </h3>

        <p
          className={`text-[14px] leading-[1.75] mb-6 flex-1 transition-colors duration-250 ${
            hovered ? "text-white/60" : "text-[#5a5248]"
          }`}
        >
          {program.desc}
        </p>

        {/* Highlight chips */}
        <div className="flex flex-col gap-2 mb-8">
          {program.highlights.map((h) => (
            <div
              key={h}
              className={`inline-flex items-center gap-2 self-start px-3 py-1.5 text-[12px] font-medium
                          border transition-all duration-250 ${
                hovered
                  ? "bg-white/10 border-white/15 text-white/70"
                  : "bg-[#f0ede6] border-[#d4cfc4] text-[#3a3530]"
              }`}
            >
              <span className="w-1 h-1 rounded-full bg-current opacity-60" />
              {h}
            </div>
          ))}
        </div>

        <a
          href="#kontakt"
          className={`text-[13px] font-semibold tracking-[0.04em] no-underline transition-colors duration-250 ${
            hovered ? "text-[#e8c84a]" : "text-[#1a2744]"
          }`}
        >
          Mehr erfahren →
        </a>
      </article>
    </Reveal>
  );
}

export default function WebsiteProgramCards() {
  return (
    <section id="kurse" className="bg-[#f0ede6] py-24 px-8">
      <div className="mx-auto max-w-[1280px]">

        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <div className="text-[12px] uppercase tracking-[0.22em] text-[#8a8070] font-semibold mb-4">
                Kursangebot
              </div>
              <h2
                className="text-[#1a2744] leading-[1.2]"
                style={{ fontFamily: "Georgia, serif", fontSize: "clamp(30px, 3vw, 44px)", fontWeight: 700 }}
              >
                Unsere Lernangebote
              </h2>
            </div>
            <a
              href="#kontakt"
              className="text-[14px] font-semibold text-[#1a2744] no-underline
                         border-b-2 border-[#e8c84a] pb-1 hover:border-[#1a2744] transition-colors duration-200 shrink-0"
            >
              Alle Kurse anfragen →
            </a>
          </div>
        </Reveal>

        {/* Cards grid — 2px gap creates a frameless mosaic effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0.5">
          {PROGRAMS.map((program, i) => (
            <ProgramCard key={program.title} program={program} delay={i * 80} />
          ))}
        </div>

      </div>
    </section>
  );
}