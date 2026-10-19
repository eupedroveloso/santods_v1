import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function RailNavThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex gap-sm">
        <S.Block w="fit" tone="sunken" radius="full" className="flex-col items-center gap-3xs p-3xs">
          <S.Block w="xs" h="lg" elevated radius="full" className="items-center justify-center">
            <S.Circle size="xs" tone="emphasis" />
          </S.Block>
          <div className="flex size-lg items-center justify-center">
            <S.Circle size="xs" tone="base" />
          </div>
          <div className="flex size-lg items-center justify-center">
            <S.Circle size="xs" tone="base" />
          </div>
        </S.Block>
        <div className="flex min-w-0 flex-1 flex-col gap-xs">
          <S.Bar w="sm" tone="strong" />
          <S.Block h="xl" />
          <S.Bar w="md" size="sm" />
        </div>
      </div>
    </ThumbFrame>
  );
}
