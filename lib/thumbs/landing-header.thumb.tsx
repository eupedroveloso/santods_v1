import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Painel flutuante: logo, menu em trilho (ativo elevado), login e CTA. Descolado do topo. */
export function LandingHeaderThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Block elevated className="items-center justify-between gap-2xs p-3xs">
        <S.Bar w="xs" size="md" tone="strong" />
        <S.Block w="fit" tone="sunken" className="gap-3xs p-3xs">
          <S.Chip w="xs" elevated>
            <S.Bar w="2xs" size="sm" tone="strong" />
          </S.Chip>
          <S.Chip w="xs" tone="sunken">
            <S.Bar w="2xs" size="sm" />
          </S.Chip>
        </S.Block>
        <S.Button size="sm" w="xs" />
      </S.Block>
      <S.Bar w="lg" size="lg" tone="soft" />
    </ThumbFrame>
  );
}
