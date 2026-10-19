import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function NumberFieldThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Bar w="sm" tone="strong" />
      <S.Field
        placeholder="xs"
        caret
        trailing={
          <>
            <S.Button variant="soft" size="sm" square />
            <S.Button variant="soft" size="sm" square />
          </>
        }
      />
    </ThumbFrame>
  );
}
