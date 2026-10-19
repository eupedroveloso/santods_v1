import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ProgressThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex flex-col gap-2xs">
        <div className="flex justify-between">
          <S.Bar w="md" size="sm" />
          <S.Bar w="2xs" size="sm" tone="strong" />
        </div>
        <S.Block h="2xs" tone="sunken" radius="full">
          <S.Block w="lg" h="full" tone="emphasis" radius="full" />
        </S.Block>
      </div>
      <div className="flex flex-col gap-2xs">
        <div className="flex justify-between">
          <S.Bar w="sm" size="sm" />
          <S.Bar w="2xs" size="sm" tone="strong" />
        </div>
        <S.Block h="2xs" tone="sunken" radius="full">
          <S.Block w="md" h="full" tone="strong" radius="full" />
        </S.Block>
      </div>
      <div className="flex flex-col gap-2xs">
        <div className="flex justify-between">
          <S.Bar w="lg" size="sm" />
          <S.Bar w="2xs" size="sm" tone="strong" />
        </div>
        <S.Block h="2xs" tone="sunken" radius="full">
          <S.Block w="xl" h="full" tone="strong" radius="full" />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
