// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Lorem", href: "#kurse" },
  { label: "Ipsum", href: "#niveaus" },
  { label: "Dolor", href: "#service" },
  { label: "Consectetur", href: "#aktuelles" },
  { label: "Adipiscing", href: "#kontakt" },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: "98%", label: "Lorem ipsum dolor" },
  { value: "2.400+", label: "Consectetur adipiscing" },
  { value: "5", label: "Sed do eiusmod" },
  { value: "18", label: "Tempor incididunt" },
];

// ─── Programs ────────────────────────────────────────────────────────────────

export interface Program {
  icon: string;
  tag: string;
  title: string;
  desc: string;
  highlights: string[];
}

export const PROGRAMS: Program[] = [
  {
    icon: "",
    tag: "Lorem",
    title: "Lorem Ipsum Dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    highlights: [
      "Lorem ipsum",
      "Consectetur elit",
      "Tempor incididunt",
    ],
  },
  {
    icon: "",
    tag: "Ipsum",
    title: "Consectetur Adipiscing",
    desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    highlights: [
      "Ut enim",
      "Quis nostrud",
      "Commodo consequat",
    ],
  },
  {
    icon: "",
    tag: "Dolor",
    title: "Sed Do Eiusmod",
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    highlights: [
      "Duis aute",
      "Voluptate velit",
      "Nulla pariatur",
    ],
  },
  {
    icon: "",
    tag: "Amet",
    title: "Magna Aliqua",
    desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    highlights: [
      "Excepteur sint",
      "Cupidatat non",
      "Mollit anim",
    ],
  },
];

// ─── Levels ───────────────────────────────────────────────────────────────────

export interface Level {
  code: string;
  title: string;
  desc: string;
  weeks: number;
}

export const LEVELS: Level[] = [
  {
    code: "A1",
    title: "Lorem",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.",
    weeks: 10,
  },
  {
    code: "A2",
    title: "Ipsum",
    desc: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    weeks: 10,
  },
  {
    code: "B1",
    title: "Dolor",
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    weeks: 12,
  },
  {
    code: "B2",
    title: "Consectetur",
    desc: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia.",
    weeks: 14,
  },
  {
    code: "C1",
    title: "Adipiscing",
    desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.",
    weeks: 16,
  },
];

// ─── Services ────────────────────────────────────────────────────────────────

export interface Service {
  icon: string;
  title: string;
  desc: string;
}

export const SERVICES: Service[] = [
  {
    icon: "",
    title: "Lorem Ipsum",
    desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
  },
  {
    icon: "",
    title: "Consectetur",
    desc: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: "",
    title: "Adipiscing Elit",
    desc: "Ut enim ad minim veniam quis nostrud exercitation ullamco.",
  },
  {
    icon: "",
    title: "Tempor",
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
  },
  {
    icon: "",
    title: "Incididunt",
    desc: "Excepteur sint occaecat cupidatat non proident sunt in culpa.",
  },
  {
    icon: "",
    title: "Magna Aliqua",
    desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
  },
];

// ─── News ────────────────────────────────────────────────────────────────────

export interface NewsItem {
  date: string;
  category: string;
  title: string;
  lead: string;
}

export const NEWS: NewsItem[] = [
  {
    date: "May 2026",
    category: "Lorem",
    title: "Lorem Ipsum Dolor Sit Amet",
    lead: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    date: "April 2026",
    category: "Ipsum",
    title: "Consectetur Adipiscing Elit",
    lead: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    date: "March 2026",
    category: "Dolor",
    title: "Sed Do Eiusmod Tempor",
    lead: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

// ─── Footer columns ───────────────────────────────────────────────────────────

export interface FooterColumn {
  heading: string;
  links: string[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Lorem",
    links: [
      "Lorem ipsum",
      "Consectetur",
      "Adipiscing elit",
      "Sed eiusmod",
    ],
  },
  {
    heading: "Ipsum",
    links: [
      "Dolor sit",
      "Amet lorem",
      "Tempor",
      "Incididunt",
      "Magna",
    ],
  },
  {
    heading: "Dolor",
    links: [
      "Consectetur",
      "Adipiscing",
      "Tempor",
      "Lorem ipsum",
      "Magna aliqua",
    ],
  },
];

export const ACCREDITATIONS = [
  "Lorem Ipsum",
  "Consectetur Elit",
  "Sed Do Eiusmod",
];