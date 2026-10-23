import { Link } from "react-router-dom";

const navItems = [
  { label: "Lorem", href: "#kurse" },
  { label: "Ipsum", href: "#niveaus" },
  { label: "Dolor", href: "#service" },
  { label: "Consectetur", href: "#aktuelles" },
  { label: "Adipiscing", href: "#kontakt" },
];

export default function WebsiteNavbar() {
  return (
    <>
      {/* Top strip */}
      <div className="bg-[#e8c84a] text-[#1a2744]">
        <div className="mx-auto max-w-[1280px] px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold">
            Lorem ipsum dolor sit amet · consectetur adipiscing elit
          </div>

          <div className="flex items-center gap-6 text-[12px]">
            <a href="#" className="hover:opacity-70 transition-opacity">
              Lorem
            </a>

            <a href="#" className="hover:opacity-70 transition-opacity">
              Ipsum
            </a>

            <a href="#" className="hover:opacity-70 transition-opacity">
              Dolor
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-50 border-b border-[#d9d2c6] bg-[#FCFBF8]/95 backdrop-blur">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="flex h-24 items-center justify-between">
            {/* Logo */}
            <Link
              to="/german-learning"
              className="flex items-center gap-4 no-underline"
            >
              <div
                className="w-12 h-12 bg-[#1a2744] text-[#e8c84a]
                           flex items-center justify-center
                           text-[14px] font-bold tracking-[0.2em]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                DA
              </div>

              <div>
                <div
                  className="text-[#1a2744] text-[24px] leading-none font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Lorem Ipsum
                </div>

                <div className="text-[#8a8070] text-[12px] tracking-[0.16em] uppercase mt-1">
                  Dolor sit amet
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden xl:flex items-center gap-10">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[14px] font-medium text-[#4d463e]
                             no-underline hover:text-[#1a2744]
                             transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <a
              href="#kontakt"
              className="hidden md:inline-flex items-center gap-2
                         bg-[#1a2744] text-white text-[13px]
                         font-semibold px-6 py-3
                         no-underline hover:bg-[#2a3a60]
                         transition-colors duration-200"
            >
              Lorem Ipsum
            </a>
          </div>
        </div>
      </header>
    </>
  );
}