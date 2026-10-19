import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SettingRowThumb() {
  return (
    <ThumbFrame>
      <S.Row>
        <div className="flex flex-col gap-2xs">
          <S.Bar w="md" tone="strong" />
          <S.Bar w="lg" size="sm" />
        </div>
        <div className="ml-auto">
          <S.Chip w="xs" tone="emphasis" align="end">
            <S.Circle size="xs" tone="raised" />
          </S.Chip>
        </div>
      </S.Row>
      <S.Row divider={false}>
        <div className="flex flex-col gap-2xs">
          <S.Bar w="lg" tone="strong" />
          <S.Bar w="md" size="sm" />
        </div>
        <div className="ml-auto">
          <S.Chip w="xs" tone="strong" align="start">
            <S.Circle size="xs" tone="raised" />
          </S.Chip>
        </div>
      </S.Row>
    </ThumbFrame>
  );
}
