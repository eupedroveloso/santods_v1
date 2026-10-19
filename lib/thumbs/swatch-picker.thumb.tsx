import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SwatchPickerThumb() {
  return (
    <ThumbFrame>
      <S.Row divider={false}>
        <S.Block w="xs" h="lg" tone="strong" outline />
        <S.Bar w="md" />
      </S.Row>
      <S.Block elevated className="flex-col gap-2xs p-2xs">
        <S.Block h="lg" tone="base" />
        <S.Chip w="full" tone="soft" align="start">
          <S.Circle size="xs" tone="emphasis" />
        </S.Chip>
      </S.Block>
    </ThumbFrame>
  );
}
