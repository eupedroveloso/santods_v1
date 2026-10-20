import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Imagem alta, metrica, destaque e cartao escuro largo. */
export function BentoGridThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="grid grid-cols-3 gap-2xs">
        <S.Block h="4xl" tone="base" className="row-span-2" />
        <S.Block h="xl" tone="soft" />
        <S.Block h="xl" tone="emphasis" />
        <S.Block h="xl" tone="strong" className="col-span-2" />
      </div>
    </ThumbFrame>
  );
}
