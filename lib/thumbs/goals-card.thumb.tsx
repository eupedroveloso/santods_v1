import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/*
 * Medida (pad sm, area 152 x 88): cabecalho 16 + 8 + meta 24 (anel sm) + 8 +
 * hairline 1 + 8 + segunda meta 16 = 81 de altura. O anel fica no centro da
 * sua linha de 24, a 8 da hairline (o gap), sem encostar.
 */
export function GoalsCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center gap-xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto">
          <S.Button variant="soft" size="sm" square />
        </div>
      </div>
      <div className="flex items-center gap-xs">
        <S.Ring size="sm" value={65} />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="sm" size="sm" />
          <S.Bar w="md" tone="strong" />
        </div>
      </div>
      <S.Rule />
      <div className="flex items-center gap-xs">
        <S.Circle size="md" tone="soft" />
        <S.Bar w="fill" size="sm" />
      </div>
    </ThumbFrame>
  );
}
