import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChatHeaderThumb() {
  return (
    <ThumbFrame>
      <S.Row>
        <S.Circle size="lg" />
        <div className="flex flex-col gap-2xs">
          <S.Bar w="md" tone="strong" />
          <div className="flex items-center gap-3xs">
            <S.Circle size="xs" tone="emphasis" />
            <S.Bar w="sm" size="sm" />
          </div>
        </div>
        <div className="ml-auto flex gap-3xs">
          <S.Button variant="soft" size="sm" square />
          <S.Button variant="soft" size="sm" square />
        </div>
      </S.Row>
      <S.Block w="lg" h="xl" />
    </ThumbFrame>
  );
}
