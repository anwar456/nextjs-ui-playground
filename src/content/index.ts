import { en } from "./en";
import { id } from "./id";
import type { Dict, Locale } from "./types";

export const locales = ["en", "id"] as const satisfies readonly Locale[];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Dict> = { en, id };

export const hasLocale = (value: string): value is Locale =>
  value in dictionaries;

export const getDict = (locale: Locale): Dict => dictionaries[locale];

export type { Dict, Locale, LinkItem } from "./types";
