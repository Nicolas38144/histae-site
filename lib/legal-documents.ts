import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Locale } from "./site-config";

export const legalDocuments = {
  "conditions-utilisation": {
    labelKey: "terms",
    title: "Conditions générales d’utilisation de Histae",
  },
  "politique-confidentialite": {
    labelKey: "privacy",
    title: "Politique de confidentialité de Histae",
  },
  "consentement-donnees-sensibles": {
    labelKey: "sensitiveData",
    title: "Consentement au traitement des données sensibles",
  },
  "consentement-localisation": {
    labelKey: "location",
    title: "Consentement à l’utilisation de la localisation",
  },
} as const;

export type LegalDocumentId = keyof typeof legalDocuments;

export function isLegalDocumentId(value: string): value is LegalDocumentId {
  return Object.prototype.hasOwnProperty.call(legalDocuments, value);
}

export const legalDocumentIds = Object.keys(legalDocuments).filter(isLegalDocumentId);

export function legalDocumentHref(locale: Locale, document: LegalDocumentId): string {
  return `/${locale}/legal/${document}/`;
}

export function readLegalDocument(document: LegalDocumentId, locale: Locale): Promise<string> {
  const directory = path.join(process.cwd(), "docs", "legal");
  const file = locale === "fr"
    ? path.join(directory, `${document}.md`)
    : path.join(directory, locale, `${document}.md`);
  return readFile(file, "utf8");
}
