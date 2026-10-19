import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChatBubbleThumb() {
  return (
    <ThumbFrame>
      <div className="flex items-end gap-2xs">
        <S.Circle size="md" />
        <S.Block w="xl" className="flex-col gap-2xs p-xs">
          <S.Bar w="lg" />
          <S.Bar w="md" />
        </S.Block>
      </div>
      <div className="flex justify-end">
        <S.Block w="lg" tone="emphasis" className="flex-col gap-2xs p-xs">
          <S.Bar w="md" tone="soft" />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
