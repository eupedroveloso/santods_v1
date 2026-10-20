"use client";

import { PEOPLE, photo } from "./demo-people";
import { SocialProofToast } from "./social-proof-toast";
import type { DemoMap } from "./registry.types";

export const socialProofToastDemos: DemoMap = {
  "social-proof-toast": {
    demos: [
      {
        title: "Na moldura (placement frame)",
        layout: "stretch",
        code: `<SocialProofToast name="Sena" avatarSrc={photo("sena", 40)} message="acabou de garantir o Venda Todo Santo Dia" />`,
        Preview: () => (
          <div className="flex h-(--santo-dimension-space-160) w-full flex-col justify-end">
            <SocialProofToast placement="frame" name={PEOPLE.sena.name.split(" ")[0]} avatarSrc={photo("sena", 40)} message="acabou de garantir o Venda Todo Santo Dia" />
          </div>
        ),
      },
    ],
  },
};
