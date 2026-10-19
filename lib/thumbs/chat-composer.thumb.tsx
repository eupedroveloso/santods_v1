import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChatComposerThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Block w="lg" radius="full" className="items-center p-xs">
        <S.Bar w="md" />
      </S.Block>
      <S.Field
        leading={<S.Button variant="soft" size="sm" square />}
        placeholder="md"
        trailing={<S.Button size="sm" square />}
      />
    </ThumbFrame>
  );
}
