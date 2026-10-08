import { readFile } from "node:fs/promises";
import path from "node:path";
import siteConfig from "../config/site.json";
import type { Locale } from "./site-config";

export const legalDocuments = siteConfig.legalDocuments;

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
  const source = legalDocuments[document].source;
  const file = locale === "fr"
    ? path.join(directory, `${source}.md`)
    : path.join(directory, locale, `${source}.md`);
  return readFile(file, "utf8");
}
