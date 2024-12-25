import { getSections } from "@/lib/services/rule.service";
import { MenuClient } from "./menu-client";

export async function Menu() {
  const sections = await getSections();
  return <MenuClient initialSections={sections} />;
}
