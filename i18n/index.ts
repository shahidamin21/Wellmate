import en from "./en.json";
import fa from "./fa.json";
import ps from "./ps.json";

export const languages = { en, ps, fa };
export type LanguageCode = keyof typeof languages;

// Support nested keys using dot notation like "checkin.title"
export function t(key: string, lang: LanguageCode = "en"): any {
  const keys = key.split(".");
  let result: any = languages[lang];

  for (const k of keys) {
    if (result && k in result) {
      result = result[k];
    } else {
      return key; // fallback to key if not found
    }
  }
  return result;
}
