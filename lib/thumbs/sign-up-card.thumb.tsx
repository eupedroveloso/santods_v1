import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SignUpCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex gap-2xs">
        <S.Button variant="soft" w="fill" />
        <S.Button variant="soft" w="fill" />
      </div>
      <S.Field />
      <S.Button w="full" />
    </ThumbFrame>
  );
}
