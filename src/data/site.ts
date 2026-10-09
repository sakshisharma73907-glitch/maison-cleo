export type Product = {
  id: string;
  name: string;
  price: number;
  tag: string;
  image: string;
  hover: string;
};

export type Lookish = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  image: string;
  pieces: string[];
};

export type Category = {
  name: string;
  sub: string;
  image: string;
};

export type Review = {
  quote: string;
  name: string;
  origin: string;
};

export type Instagram = {
  image: string;
  alt: string;
};

const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const COLLECTION = "Fall — Winter 2026";

export const NAV = [
  { label: "Shop", href: "#shop" },
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "Brands", href: "#brands" },
  { label: "Sale", href: "#sale" },
];

export const BRANDS = [
  "Vince",
  "Velvet",
  "Ulla Johnson",
  "Free People",
  "Veronica Beard",
  "Rails",
];

export const NEW_ARRIVALS: Product[] = [
  {
    id: "floral-midi-dress",
    name: "Azalea Floral Midi Dress",
    price: 178,
    tag: "New",
    image: img("photo-1572804013309-59a88b7e92f1"),
    hover: img("photo-1496747611176-843222e1e57c"),
  },
  {
    id: "cable-knit-cardigan",
    name: "Cable-Knit Cardigan",
    price: 142,
    tag: "New",
    image: img("photo-1517841905240-472988babdf9"),
    hover: img("photo-1434389677669-e08b4cac3105"),
  },
  {
    id: "silk-shell",
    name: "The Silk Shell",
    price: 128,
    tag: "New",
    image: img("photo-1503342217505-b0a15ec3261c"),
    hover: img("photo-1607746882042-944635dfe10e"),
  },
  {
    id: "moto-jacket",
    name: "Vintage Moto Jacket",
    price: 328,
    tag: "New",
    image: img("photo-1487222477894-8943e31ef7b2"),
    hover: img("photo-1515372039744-b8f02a3ae446"),
  },
  {
    id: "ribbed-tank",
    name: "Ribbed Layering Tank",
    price: 96,
    tag: "New",
    image: img("photo-1558769132-cb1aea458c5e"),
    hover: img("photo-1489987707025-afc232f7ea0f"),
  },
];

export const CATEGORIES: Category[] = [
  {
    name: "Tops & Blouses",
    sub: "Silks, knits & everyday essentials",
    image: img("photo-1509631179647-0177331693ae", 1200),
  },
  {
    name: "Dresses & Skirts",
    sub: "From picnic days to party nights",
    image: img("photo-1595777457583-95e059d581b8", 1200),
  },
  {
    name: "Outerwear & Layers",
    sub: "Coats that finish every look",
    image: img("photo-1744112908363-e3014e0553c0", 1200),
  },
];

export const LOOKS: Lookish[] = [
  {
    id: "city-in-camel",
    name: "Look 01 — City in Camel",
    tagline: "Effortless tailoring",
    blurb:
      "A softly structured coat over a silk shell and wide-leg trouser. The uniform we reach for all season long.",
    image: img("photo-1469334031218-e382a71b716b", 1400),
    pieces: ["Camel Wool Coat", "The Silk Shell", "Wide-Leg Trouser"],
  },
  {
    id: "weekend-slip",
    name: "Look 02 — The Weekend Slip",
    tagline: "Back to the market",
    blurb:
      "Our floral midi dress with a woven bag and worn-in flats. Leave the rulebook at home.",
    image: img("photo-1524504388940-b1c1722653e1", 1400),
    pieces: ["Azalea Floral Midi Dress", "Woven Market Bag", "Leather Flats"],
  },
  {
    id: "soft-focus",
    name: "Look 03 — Soft Focus",
    tagline: "Dressing for the flicker",
    blurb:
      "Bare shoulders, a whisper of satin, and a fine-gauge knit thrown over. Golden-hour, personified.",
    image: img("photo-1534528741775-53994a69daeb", 1400),
    pieces: ["Satin Slip Top", "Fine-Gauge Knit", "Foldover Skirt"],
  },
];

export const BESTSELLERS: Product[] = [
  {
    id: "coastal-midi-dress",
    name: "Coastal Midi Dress",
    price: 188,
    tag: "Bestseller",
    image: img("photo-1496747611176-843222e1e57c"),
    hover: img("photo-1572804013309-59a88b7e92f1"),
  },
  {
    id: "clementine-bag",
    name: "Clementine Leather Bag",
    price: 264,
    tag: "Bestseller",
    image: img("photo-1485968579580-b6d095142e6e"),
    hover: img("photo-1492707892479-7bc8d5a4ee93"),
  },
  {
    id: "cloud-knit",
    name: "Cloud Knit Sweater",
    price: 142,
    tag: "Bestseller",
    image: img("photo-1529139574466-a303027c1d8b"),
    hover: img("photo-1517841905240-472988babdf9"),
  },
  {
    id: "checked-poplin",
    name: "Checked Poplin Shirt",
    price: 118,
    tag: "Bestseller",
    image: img("photo-1607746882042-944635dfe10e"),
    hover: img("photo-1509631179647-0177331693ae"),
  },
];

export const REVIEWS: Review[] = [
  {
    quote:
      "Maison Cleo is my happy place in East Nashville. The edit is small, considered, and every single piece has lasted me years.",
    name: "Anne-Marie S.",
    origin: "East Nashville",
  },
  {
    quote:
      "They helped me style a complete fall wardrobe in one visit. I walked in with nothing to wear and walked out feeling like myself again.",
    name: "Claire B.",
    origin: "Germantown",
  },
  {
    quote:
      "The kind of shop that remembers your name, your sizes, and your taste. I've never once left empty-handed.",
    name: "Priya R.",
    origin: "12 South",
  },
];

export const INSTAGRAM: Instagram[] = [
  {
    image: img("photo-1445205170230-053b83016050", 800),
    alt: "Rack of colorful garments at Maison Cleo",
  },
  {
    image: img("photo-1555529669-e69e7aa0ba9a", 800),
    alt: "Assorted clothes in store",
  },
  {
    image: img("photo-1567401893414-76b7b1e5a7a5", 800),
    alt: "Soft-toned clothing display",
  },
  {
    image: img("photo-1520006403909-838d6b92c22e", 800),
    alt: "Clothing rack styled for the season",
  },
  {
    image: img("photo-1483985988355-763728e1935b", 800),
    alt: "Shopper with Maison Cleo bags",
  },
  {
    image: img("photo-1490481651871-ab68de25d43d", 800),
    alt: "Autumn layers on a rail",
  },
];

export const ABOUT_IMAGE = img(
  "photo-1441986300917-64674bd600d8",
  1400,
);

export const HERO_IMAGE = img(
  "photo-1469334031218-e382a71b716b",
  2200,
);

export const ADDRESS = {
  lines: ["1112 Eastland Avenue", "Nashville, TN 37206"],
  hours: ["Tue–Sat · 10am – 6pm", "Sun · 11am – 4pm"],
  phone: "(615) 555-0134",
};