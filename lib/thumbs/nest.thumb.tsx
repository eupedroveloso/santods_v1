import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Moldura sunken com painel elevado e um bloco dentro: o mesmo recuo em cada nivel. */
export function NestThumb() {
  return (
    <ThumbFrame>
      <S.Block tone="sunken" track className="flex-1 flex-col">
        <S.Block elevated className="flex-1 flex-col gap-2xs p-2xs">
          <S.Bar w="sm" size="sm" />
          <S.Block tone="soft" className="flex-1 items-center justify-center">
            <S.Circle size="xs" tone="emphasis" />
          </S.Block>
        </S.Block>
      </S.Block>
    </ThumbFrame>
  );
}
