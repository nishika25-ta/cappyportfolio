export type Tier = {
  name: string;
  price: number;
  includes: string[];
};

export type Service = {
  id: string;
  title: string;
  lede: string;
  from: number;
  cta: string;
  message: string;
  note: string;
  tiers: Tier[];
};

export const services: Service[] = [
  {
    id: "websites",
    title: "Websites that make an impression.",
    lede: "A clean, mobile-friendly home for a shop, café, or person starting out.",
    from: 129,
    cta: "Build my website",
    message:
      "Hi! I'm interested in your website design packages.",
    note: "Hosting, a domain name, and paid third-party tools are quoted separately. Kitty Starter aims for about 48 hours after your materials arrive and the schedule is confirmed. That is a target, not a promise on a busy week. Extra page RM40. Bilingual content RM50. Extra revision RM30.",
    tiers: [
      {
        name: "Kitty Starter",
        price: 129,
        includes: [
          "1-page responsive website",
          "1 revision",
          "Aimed at about 48 hours once materials and the schedule are confirmed",
        ],
      },
      {
        name: "Mochi Business",
        price: 299,
        includes: ["Up to 4 pages", "Responsive design", "2 revisions"],
      },
      {
        name: "Tora Pro",
        price: 599,
        includes: [
          "Up to 6 pages",
          "3 revisions",
          "Basic SEO, analytics, and CMS setup when we agree it in the scope",
        ],
      },
    ],
  },
  {
    id: "resumes",
    title: "Make your next move count.",
    lede: "A clear, tidy résumé shaped for the role you actually want.",
    from: 19,
    cta: "Improve my résumé",
    message: "Hi! I'm interested in your résumé/CV services.",
    note: "I format and clarify what you already did. I will not invent jobs, dates, or qualifications. No résumé service can guarantee an interview or a hire.",
    tiers: [
      {
        name: "Kitten Fix",
        price: 19,
        includes: [
          "1-page ATS-friendly résumé",
          "Clean formatting and basic wording",
          "1 revision",
        ],
      },
      {
        name: "Paw Career",
        price: 49,
        includes: [
          "Up to 2 pages",
          "Tailored to a target role, with relevant keywords",
          "2 revisions",
          "Cover letter on request",
        ],
      },
      {
        name: "Meow Pro",
        price: 89,
        includes: [
          "Up to 2 pages, tailored",
          "Cover letter included",
          "Basic LinkedIn profile guidance",
          "3 revisions",
        ],
      },
    ],
  },
  {
    id: "food",
    title: "Make every dish look its best.",
    lede: "Natural-looking food photos for menus, GrabFood, and social posts.",
    from: 15,
    cta: "Enhance my photos",
    message: "Hi! I'm interested in your food image enhancement services.",
    note: "The dish stays the dish: same ingredients, same portion, same plate. Extra image RM8. Simple menu layout RM30, quoted before any work. Text or logo placement RM10.",
    tiers: [
      {
        name: "Kitten Touch-Up",
        price: 15,
        includes: ["1 food image", "Natural basic enhancement"],
      },
      {
        name: "Meow Makeover",
        price: 39,
        includes: ["3 images", "Polished natural editing", "A consistent look"],
      },
      {
        name: "Big Cat Bundle",
        price: 79,
        includes: [
          "8 images",
          "More careful editing, still truthful",
          "A consistent look across the set",
        ],
      },
    ],
  },
];
