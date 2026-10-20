import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CalendarCardThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex flex-col gap-2xs">
        <div className="flex justify-between"><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /></div>
        <div className="flex justify-between"><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /></div>
        <div className="flex justify-between"><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="emphasis" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /></div>
        <div className="flex justify-between"><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /></div>
        <div className="flex justify-between"><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /><S.Circle size="sm" tone="soft" /></div>
      </div>
    </ThumbFrame>
  );
}
