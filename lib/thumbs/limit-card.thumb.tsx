import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function LimitCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center gap-xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto"><S.Block w="fit" tone="sunken" radius="full" className="gap-3xs p-3xs"><S.Chip w="xs" elevated /><S.Chip w="xs" tone="sunken" /></S.Block></div>
      </div>
      <div className="flex items-end gap-2xs">
        <S.Bar w="lg" size="lg" tone="emphasis" />
        <S.Bar w="xs" size="sm" />
      </div>
      <S.Block h="2xs" tone="sunken" radius="full" />
      <S.Button variant="soft" w="full" />
    </ThumbFrame>
  );
}
