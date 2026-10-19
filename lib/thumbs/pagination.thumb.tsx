import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function PaginationThumb() {
  return (
    <ThumbFrame>
      <div className="flex flex-col">
        <S.Row>
          <S.Bar w="lg" />
        </S.Row>
        <S.Row>
          <S.Bar w="md" />
        </S.Row>
      </div>
      <div className="flex items-center gap-2xs">
        <S.Bar w="md" size="sm" />
        <div className="ml-auto flex gap-3xs">
          <S.Button variant="soft" size="sm" square />
          <S.Button size="sm" square />
          <S.Button variant="soft" size="sm" square />
        </div>
      </div>
    </ThumbFrame>
  );
}
