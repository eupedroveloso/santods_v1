import type { Brand, BrandOverrides, TokenDoc } from "./types";

export declare function emptyBrand(id: string, name?: string): Brand;
export declare function collectionOf(doc: TokenDoc, tokenName: string): string | null;
export declare function applyBrand(baseDoc: TokenDoc, brand: Brand | null | undefined): TokenDoc;
export declare function diffToOverrides(baseDoc: TokenDoc, editedDoc: TokenDoc): BrandOverrides;
export declare function countOverrides(overrides: BrandOverrides | null | undefined): number;
