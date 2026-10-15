export type Locale = "en" | "id";

export type LinkItem = { label: string; href: string };

export type Dict = {
  meta: { title: string; description: string };
  nav: {
    about: string;
    work: string;
    experience: string;
    skills: string;
    contact: string;
    theme: string;
    menu: string;
  };
  hero: {
    status: string;
    name: string;
    roles: string[];
    intro: string;
    ctaContact: string;
    ctaCv: string;
    scroll: string;
  };
  highlights: { value: string; label: string }[];
  about: { eyebrow: string; title: string; paragraphs: string[] };
  work: {
    eyebrow: string;
    title: string;
    intro: string;
    labels: {
      context: string;
      role: string;
      built: string;
      outcome: string;
      stack: string;
      details: string;
      close: string;
      info: string;
      screenshots: string;
    };
    repoSoon: string;
    items: {
      name: string;
      image: string;
      summary: string;
      shots: { title: string; caption: string; image?: string; portrait?: boolean }[];
      kicker: string;
      period: string;
      context: string;
      role: string;
      built: string;
      outcome: string;
      stack: string[];
      links: LinkItem[];
      repoSoon?: boolean;
    }[];
  };
  experience: {
    eyebrow: string;
    title: string;
    company: string;
    location: string;
    roles: { title: string; period: string; bullets: string[] }[];
  };
  skills: {
    eyebrow: string;
    title: string;
    legendExpert: string;
    legendWorking: string;
    groups: {
      name: string;
      items: { name: string; level: "expert" | "working" }[];
    }[];
    softTitle: string;
    soft: string[];
    languagesTitle: string;
    languages: string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    emailCta: string;
  };
};
