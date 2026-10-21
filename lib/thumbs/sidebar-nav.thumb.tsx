import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SidebarNavThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex gap-xs">
        <S.Block w="fit" tone="sunken" track className="flex-col items-center gap-3xs">
          <S.Block w="xs" h="lg" elevated className="items-center justify-center">
            <S.Circle size="xs" tone="emphasis" />
          </S.Block>
          <div className="flex size-lg items-center justify-center">
            <S.Circle size="xs" tone="base" />
          </div>
          <div className="flex size-lg items-center justify-center">
            <S.Circle size="xs" tone="base" />
          </div>
        </S.Block>
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="sm" size="sm" />
          <S.Block tone="sunken" track className="flex-col">
            <S.Row divider={false} active>
              <S.Bar w="fill" tone="strong" />
            </S.Row>
          </S.Block>
          <div className="flex gap-xs pl-2xs">
            <S.Rule vertical />
            <div className="flex min-w-0 flex-1 flex-col gap-xs py-3xs">
              <S.Bar w="md" />
              <S.Bar w="sm" />
            </div>
          </div>
        </div>
      </div>
    </ThumbFrame>
  );
}
