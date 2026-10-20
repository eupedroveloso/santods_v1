import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Pacote em destaque (acao primaria) e arquivos por linha com download ghost. */
export function DownloadListThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Row>
        <S.Block w="xs" h="lg" tone="soft" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="md" size="md" tone="strong" />
          <S.Bar w="lg" size="sm" />
        </div>
        <S.Button size="sm" w="xs" />
      </S.Row>
      <S.Row>
        <S.Block w="xs" h="lg" tone="soft" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="sm" size="md" tone="strong" />
          <S.Bar w="md" size="sm" />
        </div>
        <S.Button variant="soft" size="sm" square />
      </S.Row>
      <S.Row divider={false}>
        <S.Block w="xs" h="lg" tone="soft" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="sm" size="md" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <S.Button variant="soft" size="sm" square />
      </S.Row>
    </ThumbFrame>
  );
}
