import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function PreferencesCardThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center gap-xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto"><S.Chip w="xs" tone="soft" /></div>
      </div>
      <S.Row>
        <S.Bar w="fill" size="sm" tone="strong" />
        <S.Chip w="xs" tone="emphasis" align="end"><S.Circle size="xs" tone="raised" /></S.Chip>
      </S.Row>
      <S.Row divider={false}>
        <S.Bar w="fill" size="sm" tone="strong" />
        <S.Chip w="xs" tone="strong" align="start"><S.Circle size="xs" tone="raised" /></S.Chip>
      </S.Row>
    </ThumbFrame>
  );
}
