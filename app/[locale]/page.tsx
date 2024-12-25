import { Menu } from "@/components/menu";
import { RuleCard } from "@/components/rule-card";
import { Tabs } from "@/components/tabs";
import { getSections } from "@/lib/services/rule.service";

// Mark the page component as an async component
export default async function Page() {
  // Fetch data from the database
  const sections = await getSections();
  // console.log(sections[0].rules[0]);

  return (
    <>
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu />
      </div>

      <main className="flex-1 p-6 pt-4 md:pt-16 space-y-8">
        <Tabs />
        {sections.map((section) => (
          <section key={section.tag} id={section.tag}>
            <h3 className="text-lg font-semibold mb-4">{section.tag}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
              {section.rules.map((rule) => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
