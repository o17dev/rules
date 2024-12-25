"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";

import { getTranslation } from "@/lib/services/rule.service";

export type ActionTranslationResponse = {
  data: TranslationResponse;
};

type TranslationResponse = {
  success: boolean;
  data?: string;
  message?: string;
};

const schema = z.object({
  ruleId: z.string(),
  locale: z.string(),
});

export const translate = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { ruleId, locale } }): Promise<TranslationResponse> => {
  try {
    const translation = await getTranslation(ruleId, locale);

    if (!translation) {
      return { success: false, message: "Translation not found" };
    }

    return {
      success: true,
      data: translation,
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to get translation");
  }
});
