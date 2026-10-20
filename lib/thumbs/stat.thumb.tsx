import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/*
 * Medida (pad md, area 144 x 80): metadado 4 + gap 8 + linha 24 = 36 de altura.
 * Linha: numero w-4xl 64 + 4 + unidade w-lg 24 = 92, viz anel sm 24 a direita
 * (justify-between): 92 + 24 = 116 <= 144, sobram 28 entre os dois.
 */
export function StatThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Bar w="sm" size="sm" />
      <div className="flex items-center justify-between gap-xs">
        <div className="flex items-end gap-2xs">
          <S.Bar w="md" size="lg" tone="strong" />
          <S.Bar w="xs" size="sm" />
        </div>
        <S.Ring size="sm" value={68} />
      </div>
    </ThumbFrame>
  );
}
