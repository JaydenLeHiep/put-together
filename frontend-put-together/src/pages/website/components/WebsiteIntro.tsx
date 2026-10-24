import { ACCREDITATIONS } from "./Constants";
import { Reveal } from "./Hooks";

export default function WebsiteIntro() {
  return (
    <section className="bg-[#FCFBF8] py-24 px-8">
      <div className="mx-auto max-w-[1280px] grid lg:grid-cols-2 gap-24 items-start">
        {/* Left */}
        <Reveal direction="left">
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
        </Reveal>

        {/* Right */}
        <Reveal direction="right" delay={100}>
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
        </Reveal>
      </div>
    </section>
  );
}