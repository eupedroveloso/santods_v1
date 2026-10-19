import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CardFooterThumb() {
  return (
    <ThumbFrame>
      <S.Bar w="md" size="lg" tone="strong" />
      <S.Block h="lg" />
      <S.Rule />
      <div className="flex items-center justify-end gap-2xs">
        <S.Button variant="soft" size="sm" />
        <S.Button size="sm" />
      </div>
    </ThumbFrame>
  );
}
