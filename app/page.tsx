import JewellScene from "../components/JewellScene";
import JewellHero from "../components/JewellHero";
import JewellPitch from "../components/JewellPitch";
import JewellArsenal from "../components/JewellArsenal";
import JewellShips from "../components/JewellShips";
import ChatSection from "../components/ChatSection";
import JewellContact from "../components/JewellContact";
import FooterClient from "../components/Footer";
import HopperMascot from "../components/HopperMascot";
import ChatWidget from "../components/ChatWidget";
import { getSettingsOrThrow, getPortfolioItems, getSocialLinks } from "../lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, items, socials] = await Promise.all([
    getSettingsOrThrow(),
    getPortfolioItems(),
    getSocialLinks(),
  ]);
  void settings;

  return (
    <>
      <JewellScene shipCount={items.length} skillCount={4} />
      <main id="jj-track" className="relative">
        <JewellHero />
        <div className="h-28 sm:h-44" aria-hidden="true" />
        <JewellPitch />
        <JewellArsenal />
        <JewellShips items={items} />
        <ChatSection />
        <JewellContact />
      </main>
      <FooterClient links={socials.map((s) => ({ platform: s.platform, url: s.url }))} />
      <HopperMascot />
      <ChatWidget />
    </>
  );
}