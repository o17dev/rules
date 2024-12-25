import { redis } from "@/lib/redis";
import { getSections } from "@/lib/services/rule.service";
export async function getPopularRules() {
  const sections = await getSections();

  const sectionsWithCounts = await Promise.all(
    sections.map(async (section) => {
      const rulesWithCounts = await Promise.all(
        section.rules.map(async (rule) => {
          const count = await redis.get(`rules:${rule.slug}`);
          return {
            ...rule,
            count: Number(count) || 0,
          };
        }),
      );

      const sortedRules = rulesWithCounts.sort((a, b) => b.count - a.count);
      const totalCount = sortedRules.reduce((sum, rule) => sum + rule.count, 0);

      return {
        ...section,
        rules: sortedRules,
        totalCount,
      };
    }),
  );

  return sectionsWithCounts.sort((a, b) => b.totalCount - a.totalCount);
}
