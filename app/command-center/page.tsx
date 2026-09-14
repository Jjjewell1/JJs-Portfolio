import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/actions";
import { LoginForm, AdminDashboard } from "@/components/CommandCenter";

export const dynamic = "force-dynamic";

export default async function CommandCenterPage() {
  const session = await getSession();
  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-5 text-paper">
        <LoginForm />
      </main>
    );
  }

  const prisma = await getPrisma();
  const [portfolioItems, socialLinks, pricingTiers, settings, leads] = await Promise.all([
    prisma.portfolioItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.pricingTier.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  return (
    <AdminDashboard
      portfolioItems={portfolioItems}
      socialLinks={socialLinks}
      pricingTiers={pricingTiers}
      settings={settings}
      leads={leads}
    />
  );
}