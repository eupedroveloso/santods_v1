import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CalendarThumb() {
  return (
    <ThumbFrame>
      <div className="flex items-center gap-2xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto flex gap-3xs">
          <S.Button variant="soft" size="sm" square />
          <S.Button variant="soft" size="sm" square />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-3xs">
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="base" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="emphasis" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="base" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
        <S.Block h="sm" tone="soft" />
      </div>
    </ThumbFrame>
  );
}
