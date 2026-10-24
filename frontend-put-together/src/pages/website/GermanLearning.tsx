import WebsiteNavbar from "./components/WebsiteNavbar";
import WebsiteHero from "./components/WebsiteHero";
import WebsiteIntro from "./components/WebsiteIntro";
import WebsiteProgramCards from "./components/WebsiteProgramCards";
import WebsiteLevelSection from "./components/WebsiteLevelSection";
import WebsiteServiceSection from "./components/WebsiteServiceSection";
import WebsiteNewsSection from "./components/WebsiteNewsSection";
import WebsiteFooter from "./components/WebsiteFooter";
import "./components/website-animations.css";

export default function GermanLearningWebsite() {
  return (
    <div className="lila-website min-h-screen bg-white text-slate-900">
      <div className="min-h-screen bg-white text-slate-900">
        <WebsiteNavbar />
        <main>
          <WebsiteHero />
          <WebsiteIntro />
          <WebsiteProgramCards />
          <WebsiteLevelSection />
          <WebsiteServiceSection />
          <WebsiteNewsSection />
        </main>
        <WebsiteFooter />
      </div>

    </div>
  );
}