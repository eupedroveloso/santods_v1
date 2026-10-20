import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Titulo, paragrafo, lista com marcador e um trecho de codigo: texto lido, nao cartao. */
export function MarkdownViewThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Bar w="md" size="md" tone="emphasis" />
      <div className="flex flex-col gap-2xs">
        <S.Bar w="xl" />
        <S.Bar w="lg" />
      </div>
      <div className="flex flex-col gap-2xs pl-sm">
        <S.Bar w="md" />
        <S.Bar w="sm" />
      </div>
      <S.Block className="flex-col gap-2xs p-xs">
        <S.Bar w="lg" tone="strong" />
        <S.Bar w="sm" />
      </S.Block>
    </ThumbFrame>
  );
}
