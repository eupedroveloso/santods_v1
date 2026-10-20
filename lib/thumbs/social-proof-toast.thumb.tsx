import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Aviso no canto inferior esquerdo: avatar, frase e fechar. */
export function SocialProofToastThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex h-full flex-col justify-end">
        <S.Block w="fit" elevated className="items-center gap-2xs p-2xs">
          <S.Circle size="sm" tone="emphasis" />
          <div className="flex flex-col gap-3xs">
            <S.Bar w="md" size="sm" tone="strong" />
            <S.Bar w="sm" size="sm" />
          </div>
          <S.Block w="2xs" h="xs" tone="strong" />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
