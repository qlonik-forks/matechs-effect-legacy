import { InterfaceA } from "../../config"
import { projectFieldWithEnv, memo, mapRecord } from "../../utils"
import { eqApplyConfig } from "../config"
import { EqType, EqURI } from "../hkt"

import * as E from "@matechs/core/Eq"
import { introduce } from "@matechs/core/Function"
import type { AnyEnv } from "@matechs/morphic-alg/config"
import type { MatechsAlgebraObject1 } from "@matechs/morphic-alg/object"

const asPartial = <T>(x: EqType<T>): EqType<Partial<T>> => x as any

declare module "@matechs/morphic-alg/object" {
  interface InterfaceConfig<Props> {
    [EqURI]: {
      eq: InterfaceA<Props, E.URI>
    }
  }
  interface PartialConfig<Props> {
    [EqURI]: {
      eq: InterfaceA<Props, E.URI>
    }
  }
  interface BothConfig<Props, PropsPartial> {
    [EqURI]: {
      eq: InterfaceA<Props, E.URI>
      eqPartial: InterfaceA<PropsPartial, E.URI>
    }
  }
}

export const eqOrUndefined = <A>(eq: E.Eq<A>): E.Eq<A | undefined> => ({
  equals: (x, y) =>
    typeof x === "undefined" && typeof y === "undefined"
      ? true
      : typeof x === "undefined"
      ? false
      : typeof y === "undefined"
      ? false
      : eq.equals(x, y)
})

export const eqObjectInterpreter = memo(
  <Env extends AnyEnv>(): MatechsAlgebraObject1<EqURI, Env> => ({
    _F: EqURI,
    interface: (props, _name, config) => (env) =>
      new EqType(
        introduce(projectFieldWithEnv(props, env)("eq"))((eq) =>
          eqApplyConfig(config)(E.getStructEq(eq), env, { eq: eq as any })
        )
      ),
    partial: (props, _name, config) => (env) =>
      asPartial(
        new EqType(
          introduce(projectFieldWithEnv(props, env)("eq"))((eq) =>
            eqApplyConfig(config)(
              E.getStructEq(mapRecord(eq, eqOrUndefined)) as any,
              env,
              { eq: eq as any }
            )
          )
        )
      ),
    both: (props, partial, _name, config) => (env) =>
      new EqType(
        introduce(projectFieldWithEnv(props, env)("eq"))((eq) =>
          introduce(projectFieldWithEnv(partial, env)("eq"))((eqPartial) =>
            eqApplyConfig(config)(
              E.getStructEq({ ...eq, ...mapRecord(eqPartial, eqOrUndefined) } as any),
              env,
              {
                eq: eq as any,
                eqPartial: eqPartial as any
              }
            )
          )
        )
      ) as any
  })
)