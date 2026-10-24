import { useState } from "react";
import { PROGRAMS, type Program } from "./Constants";
import { Reveal } from "./Hooks";

interface ProgramCardProps {
  program: Program;
  delay: number;
}

function ProgramCard({ program, delay }: ProgramCardProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const active = hovered || focused;

  return (
    <Reveal delay={delay} className="h-full">
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(false);
          }
        }}
        className={[
          "website-card relative flex flex-col h-full p-10 border-t-[3px]",
          active
            ? "bg-[#1a2744] border-t-[#e8c84a]"
            : "bg-[#FCFBF8] border-t-[#1a2744]",
        ].join(" ")}
      >
        <div className="text-[32px] mb-5">
          {program.icon}
        </div>

        <div
          className={[
            "text-[11px] uppercase tracking-[0.2em] font-semibold mb-3",
            "transition-colors duration-200 motion-reduce:transition-none",
            active ? "text-[#e8c84a]" : "text-[#8a8070]",
          ].join(" ")}
        >
          {program.tag}
        </div>

        <h3
          className={[
            "text-[22px] font-bold leading-[1.25] mb-4",
            "transition-colors duration-200 motion-reduce:transition-none",
            active ? "text-white" : "text-[#1a2744]",
          ].join(" ")}
          style={{ fontFamily: "Georgia, serif" }}
        >
          {program.title}
        </h3>

        <p
          className={[
            "text-[14px] leading-[1.75] mb-6 flex-1",
            "transition-colors duration-200 motion-reduce:transition-none",
            active ? "text-white/75" : "text-[#5a5248]",
          ].join(" ")}
        >
          {program.desc}
        </p>

        {/* Highlight chips */}
        <div className="flex flex-col gap-2 mb-8">
          {program.highlights.map((highlight) => (
            <div
              key={highlight}
              className={[
                "inline-flex items-center gap-2 self-start px-3 py-1.5",
                "text-[12px] font-medium border",
                "transition-colors duration-200 motion-reduce:transition-none",
                active
                  ? "bg-white/10 border-white/15 text-white/80"
                  : "bg-[#f0ede6] border-[#d4cfc4] text-[#3a3530]",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="w-1 h-1 rounded-full bg-current opacity-60"
              />
              {highlight}
            </div>
          ))}
        </div>

        <a
          href="#kontakt"
          aria-label={`Mehr erfahren: ${program.title}`}
          className={[
            "group inline-flex items-center gap-2 self-start",
            "text-[13px] font-semibold tracking-[0.04em] no-underline",
            "transition-colors duration-200 motion-reduce:transition-none",
            "focus-visible:outline focus-visible:outline-2",
            "focus-visible:outline-offset-4 focus-visible:outline-[#e8c84a]",
            active ? "text-[#e8c84a]" : "text-[#1a2744]",
          ].join(" ")}
        >
          Mehr erfahren
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200
                       group-hover:translate-x-1 group-focus-visible:translate-x-1
                       motion-reduce:transform-none motion-reduce:transition-none"
          >
            →
          </span>
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
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(30px, 3vw, 44px)",
                  fontWeight: 700,
                }}
              >
                Unsere Lernangebote
              </h2>
            </div>

            <a
              href="#kontakt"
              className="group inline-flex items-center gap-2
                         text-[14px] font-semibold text-[#1a2744] no-underline
                         border-b-2 border-[#e8c84a] pb-1
                         hover:border-[#1a2744]
                         transition-colors duration-200 shrink-0
                         motion-reduce:transition-none"
            >
              Alle Kurse anfragen
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200
                           group-hover:translate-x-1
                           motion-reduce:transform-none
                           motion-reduce:transition-none"
              >
                →
              </span>
            </a>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0.5">
          {PROGRAMS.map((program, index) => (
            <ProgramCard
              key={program.title}
              program={program}
              delay={index * 70}
            />
          ))}
        </div>
      </div>
    </section>
  );
}