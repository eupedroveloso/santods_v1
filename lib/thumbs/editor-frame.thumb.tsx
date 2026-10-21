import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Trilho de navegação, documento no centro e painel de ajustes elevado à direita. */
export function EditorFrameThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex h-full gap-xs">
        <S.Block w="sm" h="full" tone="sunken" className="flex-col gap-3xs p-3xs">
          <S.Row active divider={false}>
            <S.Bar w="xs" size="sm" tone="emphasis" />
          </S.Row>
          <S.Row divider={false}>
            <S.Bar w="xs" size="sm" />
          </S.Row>
          <S.Row divider={false}>
            <S.Bar w="xs" size="sm" />
          </S.Row>
        </S.Block>
        <div className="flex min-w-0 flex-1 flex-col gap-2xs">
          <S.Bar w="md" size="lg" tone="strong" />
          <S.Bar w="lg" size="md" />
          <S.Bar w="sm" size="md" />
        </div>
        <S.Block w="sm" h="full" tone="sunken" className="flex-col gap-3xs p-3xs">
          <S.Block w="full" h="md" elevated />
          <S.Block w="full" h="sm" elevated />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
