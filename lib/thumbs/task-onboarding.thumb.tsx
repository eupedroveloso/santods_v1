import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TaskOnboardingThumb() {
  return <ThumbFrame pad="sm"><div className="flex items-start gap-xs"><S.Block w="fill" h="4xl" tone="base" className="gap-2xs p-2xs"><S.Block w="xs" h="full" tone="strong" /><S.Block w="fill" h="2xl" elevated /></S.Block><div className="flex min-w-0 flex-1 flex-col gap-2xs"><S.Block h="xl" tone="emphasis" /><S.Block h="md" tone="base" /><S.Block h="md" tone="base" /></div></div></ThumbFrame>;
}
