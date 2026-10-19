import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChatAttachmentThumb() {
  return (
    <ThumbFrame>
      <div className="flex flex-col items-end gap-2xs">
        <S.Block w="xl" tone="soft" className="items-center gap-xs p-xs">
          <S.Block w="xs" h="lg" tone="strong" />
          <div className="flex flex-col gap-2xs">
            <S.Bar w="md" tone="strong" />
            <S.Bar w="sm" size="sm" />
          </div>
        </S.Block>
        <S.Block w="lg" tone="emphasis" className="p-xs">
          <S.Bar w="md" tone="soft" />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
