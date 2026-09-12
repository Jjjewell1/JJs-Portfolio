import Hero, { Ticker } from "../components/Hero";
import About from "../components/About";
import Journey from "../components/Journey";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ChatSection from "../components/ChatSection";
import Contact from "../components/Contact";
import FooterClient from "../components/Footer";
import HopperMascot from "../components/HopperMascot";
import ChatWidget from "../components/ChatWidget";
import { getSettingsOrThrow, getFeaturedItems, getPortfolioItems, getSocialLinks } from "../lib/data";

export const revalidate = 60;

export default async function Home() {
  const [settings, featured, items, socials] = await Promise.all([
    getSettingsOrThrow(),
    getFeaturedItems(),
    getPortfolioItems(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Hero items={featured} />
      <Ticker />
      <About settings={settings} />
      <Journey settings={settings} />
      <Skills />
      <Projects items={items} />
      <ChatSection />
      <Contact />
      <FooterClient links={socials.map((s) => ({ platform: s.platform, url: s.url }))} />
      <HopperMascot />
      <ChatWidget />
    </>
  );
}