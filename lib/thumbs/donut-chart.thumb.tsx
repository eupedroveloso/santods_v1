import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/*
 * Medida (pad sm, area 152 x 88): titulo 8 + gap 8 + anel lg 48 = 64 de altura
 * (sobram 24). Largura: anel 48 + gap 12 + legenda (ponto 8 + 4 + barra w-2xl 40
 * = 52) = 112 <= 152. A legenda abraca o conteudo, como no componente.
 */
export function DonutChartThumb() {
  return (
    <ThumbFrame>
      <S.Bar w="md" tone="strong" />
      <div className="flex items-center gap-sm">
        <S.Ring size="lg" segments={[46, 30, 24]} />
        <div className="flex flex-col gap-2xs">
          <div className="flex items-center gap-2xs">
            <S.Circle size="xs" tone="strong" />
            <S.Bar w="sm" size="sm" />
          </div>
          <div className="flex items-center gap-2xs">
            <S.Circle size="xs" tone="base" />
            <S.Bar w="sm" size="sm" />
          </div>
          <div className="flex items-center gap-2xs">
            <S.Circle size="xs" tone="soft" />
            <S.Bar w="sm" size="sm" />
          </div>
        </div>
      </div>
    </ThumbFrame>
  );
}
