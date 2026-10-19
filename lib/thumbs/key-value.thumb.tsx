import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function KeyValueThumb() {
  return (
    <ThumbFrame>
      <S.Row>
        <S.Bar w="sm" size="sm" />
        <div className="ml-auto">
          <S.Bar w="md" tone="emphasis" />
        </div>
      </S.Row>
      <S.Row>
        <S.Bar w="sm" size="sm" />
        <div className="ml-auto">
          <S.Bar w="sm" tone="strong" />
        </div>
      </S.Row>
      <S.Row>
        <S.Bar w="sm" size="sm" />
        <div className="ml-auto">
          <S.Bar w="lg" tone="strong" />
        </div>
      </S.Row>
      <S.Row divider={false}>
        <S.Bar w="sm" size="sm" />
        <div className="ml-auto">
          <S.Bar w="sm" tone="strong" />
        </div>
      </S.Row>
    </ThumbFrame>
  );
}
