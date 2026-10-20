import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function PaymentsCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Block tone="soft" className="items-center gap-xs px-xs py-2xs">
        <S.Bar w="xs" size="sm" tone="strong" />
        <S.Bar w="sm" size="sm" tone="strong" />
        <div className="ml-auto"><S.Bar w="xs" size="sm" tone="strong" /></div>
      </S.Block>
      <S.Row>
        <S.Check on />
        <S.Chip w="xs" tone="soft" />
        <S.Bar w="fill" size="sm" />
        <S.Bar w="xs" size="sm" tone="strong" />
      </S.Row>
      <S.Row divider={false}>
        <S.Check />
        <S.Chip w="xs" tone="soft" />
        <S.Bar w="fill" size="sm" />
        <S.Bar w="xs" size="sm" tone="strong" />
      </S.Row>
    </ThumbFrame>
  );
}
