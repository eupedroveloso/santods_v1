import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Trilho no piso e punho em pastilha (sem circulo: o Switch nao tem capsula). */
export function SwitchThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center gap-xs">
        <S.Chip w="xs" tone="strong" align="start">
          <S.Block w="xs" h="xs" elevated />
        </S.Chip>
        <S.Chip w="xs" tone="emphasis" align="end">
          <S.Block w="xs" h="xs" elevated />
        </S.Chip>
      </div>
    </ThumbFrame>
  );
}
