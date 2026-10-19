import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function NavUserThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Rule />
      <S.Row divider={false}>
        <S.Circle size="lg" tone="emphasis" />
        <div className="flex flex-col gap-2xs">
          <S.Bar w="md" tone="strong" />
          <S.Bar w="lg" size="sm" />
        </div>
        <div className="ml-auto">
          <S.Block w="2xs" h="xs" tone="strong" />
        </div>
      </S.Row>
    </ThumbFrame>
  );
}
