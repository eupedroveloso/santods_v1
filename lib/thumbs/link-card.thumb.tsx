import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function LinkCardThumb() {
  return (
    <ThumbFrame>
      {/* Icone sem caixa: um glifo pequeno, nao um tile */}
      <S.Block w="2xs" h="xs" tone="emphasis" />
      <S.Bar w="lg" size="lg" tone="strong" />
      <S.Bar w="xl" size="sm" />
      <div className="flex flex-col">
        <S.Row divider={false}>
          <S.Bar w="md" />
          <div className="ml-auto">
            <S.Block w="2xs" h="xs" tone="strong" />
          </div>
        </S.Row>
        <S.Row divider={false}>
          <S.Bar w="lg" />
          <div className="ml-auto">
            <S.Block w="2xs" h="xs" tone="strong" />
          </div>
        </S.Row>
      </div>
    </ThumbFrame>
  );
}
