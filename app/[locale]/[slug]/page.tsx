import { Menu } from "@/components/menu";
import { RuleCard } from "@/components/rule-card";
import { getRuleBySlug } from "@/lib/services/rule.service";
import { prisma } from "@/lib/prisma";
import RuleContent from "@/components/rule-content";

export async function generateMetadata({
  params,
}: { params: { slug: string } }) {
  const rule = await getRuleBySlug(params.slug);

  return {
    title: rule ? `${rule.title} rule by ${rule.author.name}` : 'Rule not found',
    description: rule?.content,
  };
}

export async function generateStaticParams() {
  const rules = await prisma.rule.findMany({
    select: { slug: true }
  });
  
  return rules.map((rule) => ({
    slug: rule.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const rule = await getRuleBySlug(params.slug);

  if (!rule) {
    return <div>Rule not found</div>;
  }

  return (
    <>
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu />
      </div>

      <main className="flex-1 p-6 pt-16">
        <RuleContent
          rule={rule}
        />
      </main>
    </>
  );
}

export const dynamic = 'force-dynamic';