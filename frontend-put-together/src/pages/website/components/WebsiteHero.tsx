import { STATS } from "./Constants";

export default function WebsiteHero() {
  return (
    <section className="relative bg-[#1a2744] overflow-hidden min-h-[640px] flex items-center">
      {/* Grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Decorative giant letter */}
      <div
        className="absolute -right-10 -top-16 select-none pointer-events-none leading-none text-white/[0.025]"
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(300px, 38vw, 520px)",
          fontWeight: 700,
        }}
        aria-hidden="true"
      >
        L
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1280px] w-full px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 xl:gap-20 items-center">
          {/* Left */}
          <div>
            {/* Badge */}
            <div className="website-hero-enter inline-flex items-center gap-2.5 bg-white/[0.08] border border-white/[0.15] px-4 py-1.5 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8c84a] shrink-0" />

              <span className="text-white/70 text-[12px] uppercase tracking-[0.2em] font-medium">
                Lorem ipsum dolor sit amet
              </span>
            </div>

            {/* Headline */}
            <h1
              className="website-hero-enter website-hero-delay-1 text-white leading-[1.1] tracking-tight mb-7"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(42px, 5.5vw, 72px)",
                fontWeight: 700,
              }}
            >
              Lorem ipsum dolor
              <br />
              <span className="text-[#e8c84a]">
                sit amet consectetur
              </span>
            </h1>

            {/* Description */}
            <p className="website-hero-enter website-hero-delay-2 text-white/65 text-[18px] leading-[1.75] mb-12 max-w-[500px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam.
            </p>

            {/* Buttons */}
            <div className="website-hero-enter website-hero-delay-3 flex flex-wrap gap-4">
              <a
                href="#kurse"
                className="website-button inline-block bg-[#e8c84a] text-[#1a2744]
                           text-[14px] font-bold px-8 py-3.5
                           tracking-[0.04em] no-underline
                           hover:bg-[#f0d45a]
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-4
                           focus-visible:outline-[#e8c84a]"
              >
                Lorem Ipsum
              </a>

              <a
                href="#niveaus"
                className="website-button inline-block border border-white/30
                           text-white/85 text-[14px] font-semibold
                           px-8 py-3.5 tracking-[0.04em]
                           no-underline hover:border-white/60 hover:text-white
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-4
                           focus-visible:outline-white"
              >
                Dolor Sit
              </a>
            </div>
          </div>

          {/* Right card */}
          <div className="website-hero-enter website-hero-delay-2 bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="text-white text-[14px] font-semibold">
                  Lorem Ipsum
                </div>

                <div className="text-white/40 text-[12px] mt-1">
                  consectetur adipiscing elit
                </div>
              </div>

              <div
                className="w-12 h-12 bg-[#e8c84a] text-[#1a2744]
                           flex items-center justify-center
                           font-bold text-[14px]"
              >
                LI
              </div>
            </div>

            <div className="space-y-8">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="border-b border-white/[0.08] pb-6 last:border-b-0"
                >
                  <div
                    className="text-[#e8c84a] leading-none mb-2"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "40px",
                      fontWeight: 700,
                    }}
                  >
                    {stat.value}
                  </div>

                  <div className="text-white/55 text-[13px] leading-[1.6]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}