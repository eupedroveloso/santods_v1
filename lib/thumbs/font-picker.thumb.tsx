import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Campo-poço no topo e a lista aberta: filtro em pastilhas e a opção escolhida realçada. */
export function FontPickerThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Field w="full" caret />
      <div className="flex gap-3xs">
        <S.Chip w="xs" elevated />
        <S.Chip w="xs" />
        <S.Chip w="xs" />
      </div>
      <S.Row selected>
        <S.Bar w="md" size="md" tone="strong" />
      </S.Row>
      <S.Row divider={false}>
        <S.Bar w="lg" size="md" />
      </S.Row>
    </ThumbFrame>
  );
}
