import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TableThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex flex-col">
        <S.Block tone="soft" className="items-center gap-xs px-2xs py-2xs">
          <S.Bar w="sm" size="sm" tone="strong" />
          <S.Bar w="sm" size="sm" tone="strong" />
          <div className="ml-auto">
            <S.Bar w="xs" size="sm" tone="strong" />
          </div>
        </S.Block>
        <S.Row>
          <S.Circle size="sm" tone="emphasis" />
          <S.Bar w="md" />
          <div className="ml-auto">
            <S.Bar w="sm" />
          </div>
        </S.Row>
        <S.Row>
          <S.Circle size="sm" tone="base" />
          <S.Bar w="sm" />
          <div className="ml-auto">
            <S.Bar w="xs" />
          </div>
        </S.Row>
        <S.Row divider={false}>
          <S.Circle size="sm" tone="base" />
          <S.Bar w="md" />
          <div className="ml-auto">
            <S.Bar w="sm" />
          </div>
        </S.Row>
      </div>
    </ThumbFrame>
  );
}
