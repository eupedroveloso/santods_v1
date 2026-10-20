import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChatCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center gap-xs">
        <S.Circle size="md" />
        <S.Bar w="sm" tone="strong" />
      </div>
      <S.Block w="lg" h="sm" />
      <div className="flex justify-end"><S.Block w="md" h="sm" tone="emphasis" /></div>
      <S.Field trailing={<S.Button variant="soft" size="sm" square />} />
    </ThumbFrame>
  );
}
