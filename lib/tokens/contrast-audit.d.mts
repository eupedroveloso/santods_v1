import type { TokenDoc } from "./types";
import type { IndexEntry } from "./emit";

export type AuditPair = { fg: string; bg: string; min: 3 | 4.5; kind: "text" | "ui" };
export type AuditRow = AuditPair & { fgHex: string; bgHex: string; ratio: number; pass: boolean; knownDebt: boolean };
export declare const AUDIT_PAIRS: AuditPair[];
export declare function resolveColor(
  index: Map<string, IndexEntry>,
  name: string,
  opts?: { theme?: "Light" | "Dark"; brand?: string },
): string;
export declare function auditContrast(doc: TokenDoc, brand?: string, theme?: "Light" | "Dark"): AuditRow[];
