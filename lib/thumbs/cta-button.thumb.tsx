import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Botao largo com texto e a pastilha concentrica na ponta direita. */
export function CtaButtonThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Block tone="emphasis" className="items-center justify-between gap-xs p-2xs pl-xs">
        <S.Bar w="lg" size="md" tone="raised" />
        <S.Block w="xs" h="md" tone="strong" />
      </S.Block>
    </ThumbFrame>
  );
}
