import { notFound } from "next/navigation";
import { getDict, hasLocale } from "@/content";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Work } from "@/components/Work";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDict(lang);

  return (
    <>
      <Header lang={lang} nav={dict.nav} />
      <main>
        <Hero hero={dict.hero} highlights={dict.highlights} />
        <About about={dict.about} />
        <Skills skills={dict.skills} />
        <Experience experience={dict.experience} />
        <Work work={dict.work} />
        <Contact contact={dict.contact} />
      </main>
      <Footer />
    </>
  );
}
