import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/*
 * Medida (pad sm, area 152 x 88): titulo 8 + gap 8 + linha 32 (anel md) + gap 8
 * + botao 24 = 80 de altura (sobram 8). Linha: menos 16 · anel 32 · mais 16,
 * espalhados (justify-between) em 152.
 */
export function DailyGoalCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Bar w="md" tone="strong" />
      <div className="flex items-center justify-between gap-xs">
        <S.Button variant="soft" size="sm" square />
        <S.Ring size="md" value={70} />
        <S.Button variant="soft" size="sm" square />
      </div>
      <S.Button variant="soft" w="full" />
    </ThumbFrame>
  );
}
