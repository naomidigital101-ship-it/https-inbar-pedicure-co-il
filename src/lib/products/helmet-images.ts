import foxV1 from "@/assets/helmets/fox-v1-mips.jpg";
import foxV3 from "@/assets/helmets/fox-v3-mips.jpg";
import foxV3rs from "@/assets/helmets/fox-v3rs-carbon.jpg";
import bellMx9 from "@/assets/helmets/bell-mx9.jpg";
import bellMoto10 from "@/assets/helmets/bell-moto10.jpg";
import leatt35 from "@/assets/helmets/leatt-35.jpg";
import leatt75 from "@/assets/helmets/leatt-75.jpg";
import leatt95 from "@/assets/helmets/leatt-95-carbon.jpg";
import alpineSm5 from "@/assets/helmets/alpinestars-sm5.jpg";
import alpineSm10 from "@/assets/helmets/alpinestars-sm10.jpg";
import shoeiVfx from "@/assets/helmets/shoei-vfx-wr.jpg";

export const HELMET_IMAGES: Record<string, string> = {
  "fox-v1-mips-2025": foxV1,
  "fox-v3-mips-2025": foxV3,
  "fox-v3rs-carbon-2025": foxV3rs,
  "bell-mx9-mips-2025": bellMx9,
  "bell-moto10-spherical-2025": bellMoto10,
  "leatt-35-v25": leatt35,
  "leatt-75-v25": leatt75,
  "leatt-95-carbon-v25": leatt95,
  "alpinestars-sm5-2025": alpineSm5,
  "alpinestars-sm10-carbon-2025": alpineSm10,
  "shoei-vfx-wr-2025": shoeiVfx,
};

export const getHelmetImage = (slug: string): string =>
  HELMET_IMAGES[slug] ?? foxV1;