import { isHex, type Hex } from "viem";

import { BUILDER_CODE, BUILDER_CODE_HEX } from "@/lib/config/contracts";

export const appAttribution = {
  builderCode: BUILDER_CODE,
  encodedString: BUILDER_CODE_HEX,
} as const;

export function getDataSuffix(): Hex | undefined {
  return isHex(BUILDER_CODE_HEX, { strict: true }) ? (BUILDER_CODE_HEX as Hex) : undefined;
}