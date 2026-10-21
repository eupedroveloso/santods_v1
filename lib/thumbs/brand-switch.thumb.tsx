import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Gatilho com o ponto da marca ativa e o chevron; painel com as marcas, a ativa marcada. */
export function BrandSwitchThumb() {
  return (
    <ThumbFrame>
      <S.Field placeholder="sm" leading={<S.Circle size="xs" tone="strong" />} trailing={<S.Block w="2xs" h="xs" tone="strong" />} w="lg" />
      <S.Block elevated className="flex-col p-2xs">
        <S.Row divider={false} selected>
          <S.Circle size="xs" tone="strong" />
          <S.Bar w="md" tone="emphasis" />
        </S.Row>
        <S.Row divider={false}>
          <S.Circle size="xs" tone="base" />
          <S.Bar w="sm" />
        </S.Row>
        <S.Row divider={false}>
          <S.Circle size="xs" tone="base" />
          <S.Bar w="lg" />
        </S.Row>
      </S.Block>
    </ThumbFrame>
  );
}
