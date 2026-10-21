import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Trilho com duas marcas; a ativa elevada, com a marca em enfase. */
export function BrandSwitchThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center">
        <S.Block w="fit" tone="sunken" track className="gap-3xs">
          <S.Chip w="md" elevated>
            <S.Bar w="sm" size="sm" tone="emphasis" />
          </S.Chip>
          <S.Chip w="md" tone="sunken">
            <S.Bar w="sm" size="sm" />
          </S.Chip>
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
