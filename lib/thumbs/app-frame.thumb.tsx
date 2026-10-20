import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function AppFrameThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex gap-xs">
        <S.Block w="fit" tone="sunken" radius="full" className="flex-col gap-2xs p-3xs">
          <S.Circle size="md" tone="emphasis" />
          <S.Circle size="md" tone="soft" />
          <S.Circle size="md" tone="soft" />
        </S.Block>
        <div className="flex min-w-0 flex-1 flex-col gap-2xs">
          <S.Block h="lg" tone="soft" />
          <div className="flex gap-2xs">
            <S.Block w="fill" h="2xl" tone="soft" />
            <S.Block w="fill" h="2xl" tone="soft" />
          </div>
        </div>
      </div>
    </ThumbFrame>
  );
}
