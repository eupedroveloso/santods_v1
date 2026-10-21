import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Três passos: amostra, nome, campo-poço com valor; o editado leva o campo em foco. */
export function StepRowThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Row>
        <S.Block w="xs" h="md" tone="soft" />
        <S.Bar w="sm" size="sm" />
        <div className="ml-auto">
          <S.Field w="sm" />
        </div>
      </S.Row>
      <S.Row>
        <S.Block w="xs" h="md" tone="soft" />
        <S.Bar w="sm" size="sm" tone="strong" />
        <div className="ml-auto">
          <S.Field w="sm" caret />
        </div>
      </S.Row>
      <S.Row divider={false}>
        <S.Block w="xs" h="md" tone="soft" />
        <S.Bar w="sm" size="sm" />
        <div className="ml-auto">
          <S.Field w="sm" />
        </div>
      </S.Row>
    </ThumbFrame>
  );
}
