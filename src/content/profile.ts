/**
 * All content for this UNOFFICIAL FAN TRIBUTE to actress Miruna Magar.
 * Facts are taken from the sources listed in `sources` (checked October 2026).
 */

export const profile = {
  name: "Miruna Magar",
  fullName: "Miruna Lisara Magar",
  role: "Actress · Nepali Cinema",
  tagline:
    "Lead actress of Kabaddi 4: The Final Match and Jaari, two of the biggest box-office hits in the history of Nepali film.",
  origin: "Born in Hong Kong · Family from Dharan, Nepal",

  disclaimer: "Unofficial fan tribute. Not affiliated with or endorsed by Miruna Magar.",

  copy: {
    heroGreeting: "A fan tribute to",
    primaryCta: { label: "Filmography", href: "#films" },
    secondaryCta: { label: "Her story", href: "#about" },
    filmsEyebrow: "Filmography",
    filmsTitle: "Stories she brought to",
    filmsTitleScript: "life",
    filmsIntro: "From her 2018 debut in Lalpurja to the record-breaking Jaari films.",
    allFilmsLabel: "Every film",
    aboutEyebrow: "Her story",
    aboutTitle: "From Hong Kong and London to Nepal’s",
    aboutTitleScript: "big screen",
    timelineLabel: "Journey",
    rolesLabel: "Signature roles",
    sourcesEyebrow: "Sources",
    sourcesTitle: "Facts on this page come from",
  },

  about: [
    "Miruna Lisara Magar was born on 18 July 1994 in Hong Kong, where her father was serving with the British Army’s Royal Gurkha Rifles. Her family is from Dharan, where she lived until she was twelve before moving to London and completing her schooling there.",
    "She returned to Nepal in 2016 to pursue acting and made her film debut in 2018 with Lalpurja. Her lead role in Kabaddi 4: The Final Match (2022) made her a household name, and Jaari (2023) confirmed her as one of the highest-paid actresses in Nepali cinema.",
    "Widely credited with changing how women are portrayed in Nepali cinema, she has received a National Film Award. Beyond film she has judged television shows, worked on humanitarian causes, and served as brand ambassador for the 12th Nepal European Union Film Festival in 2023.",
  ],

  stats: [
    { value: 2018, suffix: "", label: "Film debut" },
    { value: 14, suffix: "", label: "Films, 2018–2025" },
    { value: 100, suffix: "+", label: "Days Jaari ran in theatres" },
  ],

  /** Landmark films shown as large cards. */
  featured: [
    {
      title: "Kabaddi 4: The Final Match",
      year: 2022,
      role: "Shanti",
      credits: "Directed by Ram Babu Gurung · with Dayahang Rai, Saugat Malla",
      description:
        "Her first lead role. The film became one of the highest-grossing Nepali films of all time, with a then-record opening day of रू2.90 crore.",
      tags: ["Lead role", "Box-office record"],
      accent: "#b3122e",
    },
    {
      title: "Jaari",
      year: 2023,
      role: "Hangma",
      credits: "Written & directed by Upendra Subba · with Dayahang Rai",
      description:
        "Set in 1995 in a Limbu village, Hangma and Namsang's marriage is tested by the Jaari tradition. A record-breaking hit that ran for more than 100 days.",
      tags: ["Limbu culture", "100+ days"],
      accent: "#0f5a46",
    },
    {
      title: "Mansarra",
      year: 2024,
      role: "Mansara",
      credits: "Written & directed by Upendra Subba · with Dayahang Rai, Menuka Pradhan",
      description:
        "She leads this social drama as a Limbu single mother struggling to raise her son on the outskirts of Kathmandu.",
      tags: ["Title role", "Social drama"],
      accent: "#7a4a1f",
    },
    {
      title: "Jaari 2",
      year: 2025,
      role: "Hangma",
      credits: "Sequel to Jaari",
      description: "She returns as Hangma in the follow-up to one of the most successful Nepali films ever made.",
      tags: ["Sequel", "Returning role"],
      accent: "#4b2c6b",
    },
  ],

  /** Complete filmography (role omitted where the sources don't list one). */
  filmography: [
    { year: 2018, title: "Lalpurja", role: "Parpala", note: "Debut" },
    { year: 2018, title: "Rose", role: "Sneha" },
    { year: 2019, title: "Saino", role: "Anu" },
    { year: 2019, title: "Cha Cha Hui", role: "Sangeeta" },
    { year: 2022, title: "Kabaddi 4: The Final Match", role: "Shanti", note: "Lead role" },
    { year: 2023, title: "Jaari", role: "Hangma" },
    { year: 2023, title: "Nango Gau", role: "Nima" },
    { year: 2024, title: "Rangeli", role: "Junkiri" },
    { year: 2024, title: "Mansarra", role: "Mansara" },
    { year: 2024, title: "Gharjwai", role: "Binjuri" },
    { year: 2025, title: "Unko Sweater", role: "Phool Gurung" },
    { year: 2025, title: "Janai Harayeko Manchhe" },
    { year: 2025, title: "Maijharo" },
    { year: 2025, title: "Jaari 2", role: "Hangma" },
  ] as { year: number; title: string; role?: string; note?: string }[],

  timeline: [
    { period: "1994", title: "Born in Hong Kong", summary: "Her father was serving with the Royal Gurkha Rifles. The family soon returned to Dharan, Nepal." },
    { period: "2006", title: "Moves to London", summary: "Moved to the UK at twelve and completed her schooling there." },
    { period: "2016", title: "Back to Nepal", summary: "Returned home to pursue a career in acting." },
    { period: "2018", title: "Film debut", summary: "Debuted as Parpala in Lalpurja, followed by Rose the same year." },
    { period: "2022", title: "Breakthrough", summary: "Led Kabaddi 4: The Final Match as Shanti, one of the highest-grossing Nepali films ever." },
    { period: "2023", title: "Jaari", summary: "Played Hangma in Jaari and was brand ambassador of the 12th Nepal European Union Film Festival." },
    { period: "2024", title: "Critical acclaim", summary: "Earned praise for Rangeli, Mansarra and Gharjwai." },
    { period: "2025", title: "Jaari 2", summary: "Returned as Hangma, and played Phool Gurung in Unko Sweater." },
  ],

  roles: [
    "Shanti · Kabaddi 4", "Hangma · Jaari", "Nima · Nango Gau", "Junkiri · Rangeli",
    "Mansara · Mansarra", "Binjuri · Gharjwai", "Phool Gurung · Unko Sweater", "Parpala · Lalpurja",
  ],

  sources: [
    { label: "Miruna Magar", publisher: "Wikipedia", href: "https://en.wikipedia.org/wiki/Miruna_Magar" },
    { label: "Kabaddi 4: The Final Match", publisher: "Wikipedia", href: "https://en.wikipedia.org/wiki/Kabaddi_4:_The_Final_Match" },
    { label: "Jaari (film)", publisher: "Wikipedia", href: "https://en.wikipedia.org/wiki/Jaari_(film)" },
    { label: "Mansarra", publisher: "Wikipedia", href: "https://en.wikipedia.org/wiki/Mansarra" },
  ],
};

export type Profile = typeof profile;
export type FeaturedFilm = Profile["featured"][number];

/** 3×3 pose grid (viewer's left/right), matching public/character/*.webp. */
export const POSES = [
  ["up-left", "up", "up-right"],
  ["left", "center", "right"],
  ["down-left", "down", "down-right"],
] as const;
