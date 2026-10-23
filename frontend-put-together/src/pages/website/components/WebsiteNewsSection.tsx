import { NEWS, type NewsItem } from "./Constants";
import { Reveal } from "../components/Hooks";

function NewsCard({
  item,
  featured,
  delay,
}: {
  item: NewsItem;
  featured: boolean;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={[
          "flex flex-col h-full p-11 transition-all duration-220 cursor-pointer",
          featured
            ? "bg-[#1a2744] border-b-[3px] border-b-[#e8c84a]"
            : "bg-[#f0ede6] border-b-[3px] border-b-transparent hover:bg-[#e8e4dc] hover:border-b-[#e8c84a]",
        ].join(" ")}
      >
        {/* Meta */}
        <div className="flex items-center gap-3 mb-7">
          <span
            className={[
              "text-[11px] font-bold uppercase tracking-[0.16em]",
              featured
                ? "text-[#e8c84a] bg-[#e8c84a]/15 px-2.5 py-1"
                : "text-[#8a8070]",
            ].join(" ")}
          >
            {item.category}
          </span>

          <span
            className={`text-[12px] ${
              featured ? "text-white/35" : "text-[#a09888]"
            }`}
          >
            {item.date}
          </span>
        </div>

        {/* Headline */}
        <h3
          className={`text-[22px] font-bold leading-[1.3] mb-4 ${
            featured ? "text-white" : "text-[#1a2744]"
          }`}
          style={{ fontFamily: "Georgia, serif" }}
        >
          {item.title}
        </h3>

        {/* Lead */}
        <p
          className={`text-[14px] leading-[1.75] flex-1 ${
            featured ? "text-white/60" : "text-[#6a6258]"
          }`}
        >
          {item.lead}
        </p>

        {/* Read more */}
        <div
          className={`mt-8 text-[13px] font-semibold tracking-[0.04em] ${
            featured ? "text-[#e8c84a]" : "text-[#1a2744]"
          }`}
        >
          Lorem Ipsum →
        </div>
      </article>
    </Reveal>
  );
}

export default function WebsiteNewsSection() {
  return (
    <>
      {/* News section */}
      <section id="aktuelles" className="bg-[#FCFBF8] py-24 px-8">
        <div className="mx-auto max-w-[1280px]">

          {/* Header */}
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">

              <div>
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
                  Lorem ipsum dolor sit amet.
                </h2>
              </div>

              <a
                href="#"
                className="text-[14px] font-semibold text-[#1a2744]
                           no-underline border-b-2 border-[#e8c84a]
                           pb-1 hover:border-[#1a2744]
                           transition-colors duration-200 shrink-0"
              >
                Lorem Ipsum →
              </a>
            </div>
          </Reveal>

          {/* News grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 items-stretch">
            {NEWS.map((item, i) => (
              <NewsCard
                key={item.title}
                item={item}
                featured={i === 0}
                delay={i * 100}
              />
            ))}
          </div>

        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-[#e8c84a] py-20 px-8">
        <div className="mx-auto max-w-[1280px] flex flex-col lg:flex-row items-center justify-between gap-12">

          <div>
            <div className="text-[12px] uppercase tracking-[0.22em] text-[#1a2744]/55 font-semibold mb-3">
              Lorem Ipsum
            </div>

            <h2
              className="text-[#1a2744] leading-[1.2]"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(28px, 2.8vw, 42px)",
                fontWeight: 700,
              }}
            >
              Lorem ipsum dolor sit amet consectetur.
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <a
              href="#kontakt"
              className="inline-block bg-[#1a2744] text-white
                         text-[14px] font-bold px-9 py-4
                         tracking-[0.04em] no-underline
                         hover:bg-[#2a3a60]
                         transition-colors duration-200"
            >
              Lorem Ipsum
            </a>

            <a
              href="#kurse"
              className="inline-block border-2 border-[#1a2744]
                         text-[#1a2744] text-[14px] font-bold
                         px-9 py-4 tracking-[0.04em]
                         no-underline hover:bg-[#1a2744]/10
                         transition-colors duration-200"
            >
              Dolor Sit
            </a>
          </div>

        </div>
      </section>
    </>
  );
}