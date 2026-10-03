import JewellServices from "../../components/JewellServices";

export const dynamic = "force-dynamic";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-void pt-10">
      <div className="mx-auto max-w-6xl px-5"><a href="/" className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 hover:text-electric">← Back to Jewellcore</a></div>
      <JewellServices />
    </main>
  );
}
