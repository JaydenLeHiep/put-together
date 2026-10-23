import { FOOTER_COLUMNS } from "./Constants";

const CONTACT_LINES = [
  "Lorem ipsum dolor sit amet",
  "consectetur@adipiscing.elit",
  "+00 123 456 789",
];

const LEGAL_LINKS = ["Lorem", "Ipsum", "Dolor"];

export default function WebsiteFooter() {
  return (
    <footer id="kontakt" className="bg-[#12182e] text-white">
      <div className="mx-auto max-w-[1280px] px-8 pt-20 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.8fr_1fr_1fr_1fr] gap-16 pb-16 border-b border-white/[0.08]">

          {/* Brand column */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 bg-[#e8c84a] flex items-center justify-center
                           text-[#1a2744] text-[13px] font-bold tracking-widest shrink-0"
                style={{ fontFamily: "Georgia, serif" }}
              >
                LI
              </div>

              <div
                className="text-[17px] font-bold text-white"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Lorem Ipsum
              </div>
            </div>

            <p className="text-white/45 text-[14px] leading-[1.8] mb-7 max-w-[280px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              {CONTACT_LINES.map((line) => (
                <div key={line} className="text-white/40 text-[13px]">
                  {line}
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#"
              className="mt-8 inline-block bg-[#e8c84a] text-[#1a2744] text-[13px] font-bold
                         px-5 py-2.5 tracking-[0.04em] no-underline
                         hover:bg-[#f0d45a] transition-colors duration-200"
            >
              Lorem Ipsum
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/35 font-semibold mb-5">
                {col.heading}
              </div>

              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[14px] text-white/55 no-underline
                               hover:text-[#e8c84a] transition-colors duration-200"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8">
          <p className="text-white/25 text-[13px] m-0">
            © 2026 Lorem Ipsum. Lorem ipsum dolor sit amet.
          </p>

          <div className="flex gap-6">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-[13px] text-white/25 no-underline
                           hover:text-white/60 transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}