import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function StatCardThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center gap-xs">
        <S.Bar w="sm" size="sm" />
        <div className="ml-auto"><S.Chip w="xs" tone="soft" /></div>
      </div>
      <div className="flex items-end gap-xs">
        <div className="flex min-w-0 flex-1 items-end gap-2xs">
          <S.Bar w="lg" size="lg" tone="strong" />
          <S.Bar w="xs" size="sm" />
        </div>
        <div className="w-4xl"><S.Line spark points={[3, 5, 4, 6, 5, 8, 9]} /></div>
      </div>
      <S.Rule />
      <div className="flex items-center gap-xs">
        <S.Bar w="sm" size="sm" />
        <div className="ml-auto"><S.Bar w="xs" size="sm" tone="strong" /></div>
      </div>
    </ThumbFrame>
  );
}
