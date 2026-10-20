import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Trilho no topo, colado a busca; ao lado, secoes com titulo e item ativo elevado. */
export function AppSidebarThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-start gap-xs">
        <S.Block w="fit" tone="sunken" radius="full" className="flex-col gap-3xs p-3xs">
          <S.Circle size="sm" tone="base" />
          <S.Block w="fit" elevated radius="full" className="p-3xs">
            <S.Circle size="xs" tone="emphasis" />
          </S.Block>
          <S.Circle size="sm" tone="base" />
        </S.Block>
        <div className="flex min-w-0 flex-1 flex-col gap-2xs">
          <S.Field w="full" />
          <S.Bar w="sm" size="sm" />
          <S.Row active>
            <S.Bar w="md" size="md" tone="strong" />
          </S.Row>
          <S.Row divider={false}>
            <S.Bar w="lg" size="md" />
          </S.Row>
        </div>
      </div>
    </ThumbFrame>
  );
}
