"use client";

import type { DemoMap } from "./registry.types";
import { Skeleton as S } from "./skeleton";

export const skeletonDemos: DemoMap = {
  skeleton: {
    demos: [
      {
        title: "Texto",
        code: `<S.Bar w="lg" size="lg" tone="strong" />
<S.Bar w="xl" />
<S.Bar w="md" size="sm" />`,
        Preview: () => (
          <div className="flex flex-col gap-xs">
            <S.Bar w="lg" size="lg" tone="strong" />
            <S.Bar w="xl" />
            <S.Bar w="md" size="sm" />
          </div>
        ),
      },
      {
        title: "Tons",
        code: `<S.Block w="sm" h="2xl" tone="raised" outline />
<S.Block w="sm" h="2xl" tone="soft" />
<S.Block w="sm" h="2xl" tone="base" />
<S.Block w="sm" h="2xl" tone="strong" />
<S.Block w="sm" h="2xl" tone="emphasis" />`,
        Preview: () => (
          <div className="flex gap-xs">
            <S.Block w="sm" h="2xl" tone="raised" outline />
            <S.Block w="sm" h="2xl" tone="soft" />
            <S.Block w="sm" h="2xl" tone="base" />
            <S.Block w="sm" h="2xl" tone="strong" />
            <S.Block w="sm" h="2xl" tone="emphasis" />
          </div>
        ),
      },
      {
        title: "Controles",
        code: `<S.Button />
<S.Button variant="soft" />
<S.Field placeholder="md" />
<S.Chip w="md" tone="soft" />
<S.Check on /> <S.Check shape="round" on />`,
        Preview: () => (
          <div className="flex w-8xl flex-col gap-sm">
            <div className="flex items-center gap-xs">
              <S.Button />
              <S.Button variant="soft" />
              <S.Button variant="soft" square />
            </div>
            <S.Field placeholder="md" />
            <div className="flex items-center gap-xs">
              <S.Chip w="md" tone="soft" />
              <S.Check on />
              <S.Check />
              <S.Check shape="round" on />
            </div>
          </div>
        ),
      },
      {
        title: "Lista",
        layout: "stretch",
        code: `<S.Row>
  <S.Circle size="lg" />
  <S.Bar w="lg" tone="strong" />
</S.Row>`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320) flex-col">
            <S.Row>
              <S.Circle size="lg" />
              <S.Bar w="lg" tone="strong" />
              <div className="ml-auto">
                <S.Bar w="sm" size="sm" />
              </div>
            </S.Row>
            <S.Row divider={false}>
              <S.Circle size="lg" tone="base" />
              <S.Bar w="md" tone="strong" />
              <div className="ml-auto">
                <S.Bar w="sm" size="sm" />
              </div>
            </S.Row>
          </div>
        ),
      },
      {
        title: "Gráficos",
        layout: "stretch",
        code: `<S.Bars values={[3, 5, 4, 7, 6]} highlight={3} />
<S.Line area points={[2, 4, 3, 6, 8]} />`,
        Preview: () => (
          <div className="mx-auto grid w-full max-w-(--santo-dimension-space-384) grid-cols-2 gap-lg">
            <S.Bars values={[3, 5, 4, 7, 6]} highlight={3} />
            <S.Line area points={[2, 4, 3, 6, 5, 8]} />
          </div>
        ),
      },
      {
        title: "Micro-viz",
        code: `<S.Ring value={68} />
<S.MiniBars values={[2, 3, 2, 4, 3]} highlight={3} />
<S.Line spark points={[3, 5, 4, 6, 8]} />`,
        Preview: () => (
          <div className="flex items-center gap-lg">
            <S.Ring value={68} />
            <S.MiniBars values={[2, 3, 2, 4, 3]} highlight={3} />
            <div className="w-6xl">
              <S.Line spark points={[3, 5, 4, 6, 5, 8]} />
            </div>
          </div>
        ),
      },
      {
        title: "Trilho",
        code: `<S.Block w="fit" tone="sunken" radius="full" className="gap-3xs p-3xs">
  <S.Chip w="sm" elevated />
  <S.Chip w="sm" tone="sunken" />
</S.Block>`,
        Preview: () => (
          <S.Block w="fit" tone="sunken" radius="full" className="gap-3xs p-3xs">
            <S.Chip w="sm" elevated>
              <S.Bar w="xs" size="sm" tone="strong" />
            </S.Chip>
            <S.Chip w="sm" tone="sunken">
              <S.Bar w="xs" size="sm" />
            </S.Chip>
          </S.Block>
        ),
      },
      {
        title: "Carregando",
        code: `<div role="status" aria-busy="true">
  <S.Bar w="lg" animated />
</div>`,
        Preview: () => (
          <div role="status" aria-busy="true" className="flex w-8xl flex-col gap-xs">
            <S.Bar w="lg" size="lg" tone="soft" animated />
            <S.Bar w="xl" tone="soft" animated />
            <S.Block h="3xl" animated />
          </div>
        ),
      },
    ],
  },
};
