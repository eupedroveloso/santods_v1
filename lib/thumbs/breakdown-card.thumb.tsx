import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Titulo e barras horizontais por categoria; a maior em enfase. */
export function BreakdownCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Bar w="md" size="lg" tone="strong" />
      <div className="flex flex-col gap-2xs">
        <div className="flex items-center gap-2xs"><S.Bar w="xs" size="sm" /><S.Block w="xl" h="xs" tone="emphasis" /></div>
        <div className="flex items-center gap-2xs"><S.Bar w="xs" size="sm" /><S.Block w="lg" h="xs" tone="base" /></div>
        <div className="flex items-center gap-2xs"><S.Bar w="xs" size="sm" /><S.Block w="md" h="xs" tone="base" /></div>
        <div className="flex items-center gap-2xs"><S.Bar w="xs" size="sm" /><S.Block w="sm" h="xs" tone="soft" /></div>
      </div>
    </ThumbFrame>
  );
}
