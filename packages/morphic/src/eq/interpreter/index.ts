import { merge, memo } from "../../utils"

import { eqIntersectionInterpreter } from "./intersection"
import { eqNewtypeInterpreter } from "./newtype"
import { eqObjectInterpreter } from "./object"
import { eqPrimitiveInterpreter } from "./primitives"
import { eqRecursiveInterpreter } from "./recursive"
import { eqRefinedInterpreter } from "./refined"
import { eqSetInterpreter } from "./set"
import { eqStrMapInterpreter } from "./str-map"
import { eqTaggedUnionInterpreter } from "./tagged-union"
import { eqUnionInterpreter } from "./union"
import { eqUnknownInterpreter } from "./unknown"

import type { AnyEnv } from "@matechs/morphic-alg/config"

export const allModelEq = <Env extends AnyEnv>() =>
  merge(
    eqRefinedInterpreter<Env>(),
    eqNewtypeInterpreter<Env>(),
    eqUnknownInterpreter<Env>(),
    eqPrimitiveInterpreter<Env>(),
    eqIntersectionInterpreter<Env>(),
    eqObjectInterpreter<Env>(),
    eqTaggedUnionInterpreter<Env>(),
    eqUnionInterpreter<Env>(),
    eqRecursiveInterpreter<Env>(),
    eqStrMapInterpreter<Env>(),
    eqSetInterpreter<Env>()
  )

export const modelEqInterpreter = memo(allModelEq) as typeof allModelEq
