import { prisma } from "./prisma";
import type { PortfolioItem, PricingTier, SiteSettings, SocialLink } from "@prisma/client";

export async function getSettings(): Promise<SiteSettings | null> {
  return prisma.siteSettings.findUnique({ where: { id: "singleton" } });
}

export async function getSettingsOrThrow(): Promise<SiteSettings> {
  const s = await getSettings();
  if (!s) throw new Error("SiteSettings singleton missing — run the seed script.");
  return s;
}

export function portfolioOrder<T extends { featured: boolean; order: number }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order
  );
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return portfolioOrder(await prisma.portfolioItem.findMany());
}

export async function getFeaturedItems(): Promise<PortfolioItem[]> {
  const items = await getPortfolioItems();
  const featured = items.filter((i) => i.featured);
  return featured.length > 0 ? featured : items.slice(0, 5);
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
}

export async function getPricingTiers(): Promise<PricingTier[]> {
  return prisma.pricingTier.findMany({ orderBy: { order: "asc" } });
}

export function splitTags(tags: string): string[] {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}