import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

import image1 from "../assets/487518966_1231459902312734_2727817993962075168_n.jpg";
import image2 from "../assets/74412333_640307566708918_2537789041542168576_n.jpg";
import image3 from "../assets/486400189_1226369159488475_66634859064942213_n.jpg";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  const userName = isAuthenticated ? user?.userName ?? "Benutzer" : null;

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-white via-lila-50 to-white">
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center rounded-full bg-lila-100 text-lila-700 px-4 py-2 text-sm font-semibold mb-6">
              Deutschschule · Online & persönlich
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Deutsch lernen mit
              <span className="block text-lila-700">
                Struktur, Klarheit und Erfolg
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-2xl">
              Unsere Plattform unterstützt Lernende auf jedem Niveau – von den
              ersten Schritten bis zur sicheren Kommunikation im Alltag, im
              Beruf und in Prüfungen. Entdecken Sie moderne Videolektionen,
              übersichtliche Kursstrukturen und ein professionelles
              Lernerlebnis.
            </p>

            {isAuthenticated && (
              <div className="mt-5 rounded-2xl border border-lila-200 bg-white/80 px-5 py-4 shadow-sm">
                <p className="text-sm text-gray-500">Willkommen zurück</p>
                <p className="text-lg font-semibold text-gray-900">{userName}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link
                  to="/after-login"
                  className="inline-flex items-center justify-center rounded-xl bg-lila-600 px-6 py-3.5 text-white font-semibold shadow-lg hover:bg-lila-700 transition-colors"
                >
                  Zum Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-lila-600 px-6 py-3.5 text-white font-semibold shadow-lg hover:bg-lila-700 transition-colors"
                  >
                    Jetzt anmelden
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Konto erstellen
                  </Link>
                  <Link
                    to="/alle-kurse"
                    className="inline-flex items-center justify-center rounded-xl border-2 border-lila-600 bg-lila-50 px-6 py-3.5 text-lila-700 font-semibold shadow-lg hover:bg-lila-100 transition-colors"
>
                    Alle Kurse
                  </Link>
                </>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FeatureCard
                title="Strukturierte Kurse"
                text="Lernen nach Kategorien, Niveaus und klaren Lernzielen."
              />
              <FeatureCard
                title="Videolektionen"
                text="Professionelle Inhalte für flexibles Lernen jederzeit."
              />
              <FeatureCard
                title="Prüfungsorientiert"
                text="Ideal für Alltag, Beruf sowie ÖSD, Goethe und ÖIF."
              />
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-lila-200 to-lila-400 rounded-3xl blur-2xl opacity-40" />

              <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/60 bg-white">
                <HeroImageCarousel />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-16 bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BottomInfo
              title="Für Anfänger und Fortgeschrittene"
              text="Ob A1 oder B2 – unsere Inhalte helfen Ihnen, systematisch und sicher Fortschritte zu machen."
            />
            <BottomInfo
              title="Flexibel lernen"
              text="Greifen Sie bequem auf Lektionen, Kommentare und Lernmaterialien zu – wann immer es für Sie passt."
            />
            <BottomInfo
              title="Klare Lernziele"
              text="Jede Lektion ist darauf ausgerichtet, verständlich, praktisch und direkt anwendbar zu sein."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

type FeatureCardProps = {
  title: string;
  text: string;
};

function FeatureCard({ title, text }: FeatureCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-6">{text}</p>
    </div>
  );
}

type BottomInfoProps = {
  title: string;
  text: string;
};

function BottomInfo({ title, text }: BottomInfoProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-600 leading-7">{text}</p>
    </div>
  );
}

function HeroImageCarousel() {
  const images = [image1, image2, image3];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [images.length]);

  function goToSlide(index: number) {
    setActiveIndex(index);
  }

  function goPrev() {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  function goNext() {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }

  return (
    <div className="relative w-full h-[300px] md:h-[420px] overflow-hidden">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Deutsch Sprachschule ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeIndex === index ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

      <button
        type="button"
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center"
        aria-label="Vorheriges Bild"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center"
        aria-label="Nächstes Bild"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all ${activeIndex === index
                ? "w-8 bg-white"
                : "w-2.5 bg-white/60 hover:bg-white/80"
              }`}
            aria-label={`Gehe zu Bild ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}