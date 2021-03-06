import { CovariantF, CovariantK } from "../../Covariant"
import { URIS } from "../../HKT"
import { IdentityFlattenF, IdentityFlattenK } from "../../IdentityFlatten"
import { AccessF, AccessK } from "../Access"

export type EnvironmentalF<
  F,
  Fix0 = any,
  Fix1 = any,
  Fix2 = any,
  Fix3 = any
> = IdentityFlattenF<F, Fix0, Fix1, Fix2, Fix3> &
  AccessF<F, Fix0, Fix1, Fix2, Fix3> &
  CovariantF<F, Fix0, Fix1, Fix2, Fix3>

export type EnvironmentalK<
  F extends URIS,
  Fix0 = any,
  Fix1 = any,
  Fix2 = any,
  Fix3 = any
> = IdentityFlattenK<F, Fix0, Fix1, Fix2, Fix3> &
  AccessK<F, Fix0, Fix1, Fix2, Fix3> &
  CovariantK<F, Fix0, Fix1, Fix2, Fix3>

export function makeEnvironmental<
  URI extends URIS,
  Fix0 = any,
  Fix1 = any,
  Fix2 = any,
  Fix3 = any
>(
  _: URI
): (
  _: Omit<
    EnvironmentalK<URI, Fix0, Fix1, Fix2, Fix3>,
    "URI" | "Fix0" | "Fix1" | "Fix2" | "Fix3"
  >
) => EnvironmentalK<URI, Fix0, Fix1, Fix2, Fix3>
export function makeEnvironmental<URI, Fix0 = any, Fix1 = any, Fix2 = any, Fix3 = any>(
  URI: URI
): (
  _: Omit<
    EnvironmentalF<URI, Fix0, Fix1, Fix2, Fix3>,
    "URI" | "Fix0" | "Fix1" | "Fix2" | "Fix3"
  >
) => EnvironmentalF<URI, Fix0, Fix1, Fix2, Fix3>
export function makeEnvironmental<URI, Fix0 = any, Fix1 = any, Fix2 = any, Fix3 = any>(
  URI: URI
): (
  _: Omit<
    EnvironmentalF<URI, Fix0, Fix1, Fix2, Fix3>,
    "URI" | "Fix0" | "Fix1" | "Fix2" | "Fix3"
  >
) => EnvironmentalF<URI, Fix0, Fix1, Fix2, Fix3> {
  return (_) => ({
    URI,
    Fix0: undefined as any,
    Fix1: undefined as any,
    Fix2: undefined as any,
    Fix3: undefined as any,
    ..._
  })
}
