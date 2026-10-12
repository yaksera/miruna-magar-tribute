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
    secondaryCta: { label: "Biography", href: "#about" },
    filmsTitle: "Filmography",
    filmsMeta: "14 films, 2018–2025. Every trailer is embedded from its official channel.",
    aboutTitle: "Biography",
    timelineLabel: "Timeline",
    sourcesTitle: "Sources",
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

  /**
   * Every film, oldest first. `trailer` is an official YouTube upload (production house or
   * distributor channel), verified via YouTube oEmbed in October 2026. Credits are only given where sourced.
   */
  films: [
    { year: 2018, title: "Lalpurja", role: "Parpala", note: "Film debut", trailer: { id: "5Rdezm4Qf1w", channel: "Budha Subba Digital", kind: "Trailer" } },
    { year: 2018, title: "Rose", role: "Sneha", trailer: { id: "BziU6prtYhc", channel: "OSR Digital", kind: "Trailer" } },
    { year: 2019, title: "Saino", role: "Anu", trailer: { id: "Rwp8RfsRJ1A", channel: "Bodhi HD", kind: "Trailer" } },
    { year: 2019, title: "Cha Cha Hui", role: "Sangeeta", trailer: { id: "ihVbgjrPK3o", channel: "OSR Digital", kind: "Trailer" } },
    {
      year: 2022,
      title: "Kabaddi 4: The Final Match",
      role: "Shanti",
      note: "First lead role",
      credits: "Directed by Ram Babu Gurung · with Dayahang Rai, Saugat Malla",
      blurb: "Became one of the highest-grossing Nepali films of all time, with a then-record opening day of रू2.90 crore.",
      trailer: { id: "aAFTcXtRvDg", channel: "Baasuri Films", kind: "Teaser" },
    },
    {
      year: 2023,
      title: "Jaari",
      role: "Hangma",
      credits: "Written & directed by Upendra Subba · with Dayahang Rai",
      blurb: "In a Limbu village in 1995, Hangma and Namsang's marriage is tested by the Jaari tradition. It ran for more than 100 days in theatres.",
      trailer: { id: "5O3K8JXch1E", channel: "Baasuri Films", kind: "Trailer" },
    },
    { year: 2023, title: "Nango Gau", role: "Nima", trailer: { id: "nwT-EuEYeBE", channel: "Budha Subba Digital", kind: "Trailer" } },
    { year: 2024, title: "Rangeli", role: "Junkiri", trailer: { id: "sdEs0tOR7hw", channel: "OSR Digital", kind: "Trailer" } },
    {
      year: 2024,
      title: "Mansarra",
      role: "Mansara",
      note: "Title role",
      credits: "Written & directed by Upendra Subba · with Dayahang Rai, Menuka Pradhan",
      blurb: "A Limbu single mother struggles to raise her son on the outskirts of Kathmandu.",
      trailer: { id: "_wGYG3sKHgQ", channel: "G21 Digital", kind: "Trailer" },
    },
    { year: 2024, title: "Gharjwai", role: "Binjuri", trailer: { id: "1WajDWLXuVU", channel: "Budha Subba Digital", kind: "Trailer" } },
    { year: 2025, title: "Unko Sweater", role: "Phool Gurung", trailer: { id: "8vafCOeuH_A", channel: "ARTMANDU", kind: "Trailer" } },
    { year: 2025, title: "Janai Harayeko Manchhe", trailer: { id: "bJl4i00eOas", channel: "OSR Digital", kind: "Trailer" } },
    { year: 2025, title: "Maijharo", trailer: { id: "ckDMJFOVTxU", channel: "OSR Digital", kind: "Trailer" } },
    {
      year: 2025,
      title: "Jaari 2: Song of Chyabrung",
      role: "Hangma",
      note: "Sequel",
      credits: "Written & directed by Upendra Subba · produced by Baasuri Films",
      blurb: "Hangma and Namsang return, reunited with the cast of the original.",
      trailer: { id: "qa7tHd560cE", channel: "Baasuri Films", kind: "Trailer" },
    },
  ] as Film[],

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


  sources: [
    { label: "Miruna Magar", publisher: "Wikipedia", href: "https://en.wikipedia.org/wiki/Miruna_Magar" },
    { label: "Kabaddi 4: The Final Match", publisher: "Wikipedia", href: "https://en.wikipedia.org/wiki/Kabaddi_4:_The_Final_Match" },
    { label: "Jaari (film)", publisher: "Wikipedia", href: "https://en.wikipedia.org/wiki/Jaari_(film)" },
    { label: "Mansarra", publisher: "Wikipedia", href: "https://en.wikipedia.org/wiki/Mansarra" },
    { label: "Jaari 2", publisher: "Wikipedia", href: "https://en.wikipedia.org/wiki/Jaari_2" },
  ],
};

export type Film = {
  year: number;
  title: string;
  role?: string;
  note?: string;
  credits?: string;
  blurb?: string;
  trailer?: { id: string; channel: string; kind: "Trailer" | "Teaser" };
};

export type Profile = typeof profile;

/** 3×3 pose grid (viewer's left/right), matching public/character/*.webp. */
export const POSES = [
  ["up-left", "up", "up-right"],
  ["left", "center", "right"],
  ["down-left", "down", "down-right"],
] as const;
