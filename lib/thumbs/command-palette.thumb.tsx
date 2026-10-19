import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CommandPaletteThumb() {
  return (
    <ThumbFrame>
      <S.Field leading={<S.Circle size="xs" />} placeholder="lg" />
      <div className="flex flex-col">
        <S.Row divider={false} selected>
          <S.Circle size="sm" tone="emphasis" />
          <S.Bar w="lg" tone="strong" />
          <div className="ml-auto">
            <S.Chip w="xs" tone="soft" />
          </div>
        </S.Row>
        <S.Row divider={false}>
          <S.Circle size="sm" />
          <S.Bar w="md" />
        </S.Row>
        <S.Row divider={false}>
          <S.Circle size="sm" />
          <S.Bar w="lg" />
        </S.Row>
      </div>
    </ThumbFrame>
  );
}
