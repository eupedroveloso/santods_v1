import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Trilha de largura total, punho (protagonista) e o valor flutuando acima dele. */
export function NumberFieldThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex flex-col gap-2xs">
        <div className="flex">
          <div className="w-(--santo-dimension-space-48)" />
          <S.Bar w="xs" size="sm" tone="strong" />
        </div>
        <div className="flex items-center">
          <S.Block w="lg" h="2xs" tone="emphasis" />
          <S.Circle size="sm" tone="emphasis" />
          <S.Block h="2xs" tone="soft" />
        </div>
      </div>
    </ThumbFrame>
  );
}
