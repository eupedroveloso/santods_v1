import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ColorPickerThumb() {
  return (
    <ThumbFrame>
      <S.Block h="2xl" tone="strong" className="items-start justify-end p-2xs">
        <S.Circle size="sm" tone="raised" />
      </S.Block>
      <S.Chip w="full" tone="base" align="start">
        <S.Circle size="xs" tone="emphasis" />
      </S.Chip>
      <S.Field leading={<S.Block w="2xs" h="md" tone="strong" outline />} placeholder="sm" />
    </ThumbFrame>
  );
}
