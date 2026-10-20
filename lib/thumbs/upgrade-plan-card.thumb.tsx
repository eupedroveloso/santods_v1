import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function UpgradePlanCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center gap-xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto"><S.Chip w="xs" tone="soft" /></div>
      </div>
      <div className="flex gap-2xs">
        <S.Block w="fill" h="xl" elevated className="items-center gap-2xs px-xs">
          <S.Check shape="round" on />
          <S.Bar w="fill" size="sm" tone="strong" />
        </S.Block>
        <S.Block w="fill" h="xl" tone="sunken" className="items-center gap-2xs px-xs">
          <S.Check shape="round" />
          <S.Bar w="fill" size="sm" />
        </S.Block>
      </div>
      <S.Button variant="soft" w="full" />
    </ThumbFrame>
  );
}
