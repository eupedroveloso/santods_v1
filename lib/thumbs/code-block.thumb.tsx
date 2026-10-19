import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CodeBlockThumb() {
  return (
    <ThumbFrame>
      <S.Block className="flex-col gap-2xs p-xs">
        <div className="flex items-center">
          <S.Bar w="sm" size="sm" />
          <div className="ml-auto">
            <S.Button variant="soft" size="sm" square />
          </div>
        </div>
        <S.Bar w="lg" tone="emphasis" />
        <div className="flex flex-col gap-2xs pl-sm">
          <S.Bar w="xl" />
          <S.Bar w="md" />
        </div>
        <S.Bar w="xs" tone="strong" />
      </S.Block>
    </ThumbFrame>
  );
}
