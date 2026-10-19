export type Project = {
  title: string;
  category: string;
  description: string;
  video: string;
  alt: string;
  technology: string;
};

export const projects: Project[] = [
  {
    title: "The Kitchen Miri",
    category: "Bakery · Kitty Starter",
    description:
      "A welcoming one-page bakery site with a clear menu and easy ordering.",
    video: "/videos/kitchen.mp4",
    alt: "Screen recording of The Kitchen Miri concept website.",
    technology: "One-page concept site",
  },
  {
    title: "Smoky Grill Miri",
    category: "Restaurant · Mochi Business",
    description:
      "A bold four-page restaurant site built around food, menus, and ordering.",
    video: "/videos/burger.mp4",
    alt: "Screen recording of the Smoky Grill Miri concept website.",
    technology: "Four-page concept site",
  },
  {
    title: "Bloom & Basket Miri",
    category: "Florist · Tora Pro",
    description:
      "An editorial six-page florist site with collections and custom enquiries.",
    video: "/videos/flower.mp4",
    alt: "Screen recording of the Bloom & Basket Miri concept website.",
    technology: "Six-page concept site",
  },
];
