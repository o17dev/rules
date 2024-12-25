import { Menu } from "@/components/menu";
import { RuleCard } from "@/components/rule-card";
import { Tabs } from "@/components/tabs";
import { getPopularRules } from "@/lib/popular";
import { RuleWithRelations } from "@/lib/services/rule.service";

export const metadata = {
  title: "Popular rules",
  description: "Popular rules for Cursor for frameworks, libraries and more.",
};

export const revalidate = 86400; // Revalidate once every day


export default async function Page() {
  const popularRules = await getPopularRules();
  console.log(popularRules);
  return (
    <>
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu />
      </div>

      <main className="flex-1 p-6 pt-4 md:pt-16 space-y-8">
        <Tabs />
        {popularRules?.map(
          (section: { tag: string; rules: RuleWithRelations[] }, idx: number) => (
            <section key={section.tag} id={section.tag}>
              <h3 className="text-lg font-semibold mb-4">{section.tag}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {section.rules.map((rule: RuleWithRelations, idx2: number) => (
                  <RuleCard key={`${idx}-${idx2.toString()}`} rule={rule} />
                ))}
              </div>
            </section>
          ),
        )}
      </main>
    </>
  );
}
