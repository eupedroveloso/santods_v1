import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function DisclosureThumb() {
  return (
    <ThumbFrame>
      <div className="flex">
        <S.Chip w="lg" tone="soft" align="start">
          <S.Block w="2xs" h="xs" tone="emphasis" />
          <S.Bar w="sm" size="sm" tone="strong" />
        </S.Chip>
      </div>
      <div className="flex flex-col gap-xs pl-md">
        <S.Bar w="lg" />
        <S.Bar w="md" />
        <S.Bar w="lg" />
      </div>
    </ThumbFrame>
  );
}
