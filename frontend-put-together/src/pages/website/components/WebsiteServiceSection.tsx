import { useState } from "react";
import { SERVICES, type Service } from "./Constants";
import { Reveal } from "../components/Hooks";

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={delay} className="h-full">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={[
          "h-full min-h-[190px] p-8 cursor-default transition-all duration-220 border-t-2",
          "flex flex-col justify-start",
          hovered
            ? "bg-white border-t-[#e8c84a]"
            : "bg-[#FCFBF8] border-t-transparent",
        ].join(" ")}
      >
        <div className="text-[28px] mb-4">{service.icon}</div>

        <div className="text-[15px] font-bold text-[#1a2744] mb-2 leading-snug">
          {service.title}
        </div>

        <div className="text-[13px] text-[#6a6258] leading-[1.65]">
          {service.desc}
        </div>
      </div>
    </Reveal>
  );
}

export default function WebsiteServiceSection() {
  return (
    <section id="service" className="bg-[#f0ede6] py-24 px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid lg:grid-cols-[360px_1fr] gap-20 items-start">
          {/* Left — copy */}
          <Reveal>
            <div>
              <div className="text-[12px] uppercase tracking-[0.22em] text-[#8a8070] font-semibold mb-4">
                Lorem Ipsum
              </div>

              <h2
                className="text-[#1a2744] leading-[1.2] mb-7"
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(30px, 3vw, 44px)",
                  fontWeight: 700,
                }}
              >
                Lorem ipsum dolor sit amet consectetur.
              </h2>

              <p className="text-[#5a5248] text-[16px] leading-[1.8] mb-10">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam.
              </p>

              <a
                href="#kontakt"
                className="inline-flex items-center gap-2.5 bg-[#1a2744] text-white text-[14px]
                           font-semibold px-7 py-3.5 tracking-[0.04em] no-underline
                           hover:bg-[#2a3a60] transition-colors duration-200"
              >
                Lorem Ipsum
              </a>
            </div>
          </Reveal>

          {/* Right — service grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 items-stretch">
            {SERVICES.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                delay={i * 60}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}