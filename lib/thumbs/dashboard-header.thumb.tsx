import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Titulo a esquerda; trilho de periodo e acao primaria a direita; grade abaixo. */
export function DashboardHeaderThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center justify-between gap-xs">
        <S.Bar w="md" size="lg" tone="strong" />
        <div className="flex items-center gap-2xs">
          <S.Block w="fit" tone="sunken" className="gap-3xs p-3xs">
            <S.Chip w="xs" elevated>
              <S.Bar w="2xs" size="sm" tone="strong" />
            </S.Chip>
            <S.Chip w="xs" tone="sunken">
              <S.Bar w="2xs" size="sm" />
            </S.Chip>
          </S.Block>
          <S.Button size="sm" w="xs" />
        </div>
      </div>
      <div className="flex gap-2xs">
        <S.Block h="lg" tone="soft" />
        <S.Block h="lg" tone="soft" />
        <S.Block h="lg" tone="soft" />
      </div>
    </ThumbFrame>
  );
}
