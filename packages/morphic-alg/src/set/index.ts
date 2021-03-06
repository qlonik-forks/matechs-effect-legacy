import type { AnyEnv, ConfigsForType } from "../config"
import type { Kind, URIS, Kind2, URIS2, HKT2 } from "../utils/hkt"

import type { Array } from "@matechs/core/Array"
import type { Ord } from "@matechs/core/Ord"
import type { Set } from "@matechs/core/Set"

export const SetURI = "@matechs/morphic-alg/SetURI" as const

export type SetURI = typeof SetURI

declare module "../utils/hkt" {
  export interface Algebra<F, Env> {
    [SetURI]: MatechsAlgebraSet<F, Env>
  }
  export interface Algebra1<F extends URIS, Env extends AnyEnv> {
    [SetURI]: MatechsAlgebraSet1<F, Env>
  }
  export interface Algebra2<F extends URIS2, Env extends AnyEnv> {
    [SetURI]: MatechsAlgebraSet2<F, Env>
  }
}

export interface SetConfig<L, A> {}

export interface MatechsAlgebraSet<F, Env> {
  _F: F
  set: <L, A>(
    a: HKT2<F, Env, L, A>,
    ord: Ord<A>,
    config?: {
      name?: string
      conf?: ConfigsForType<Env, Array<L>, Set<A>, SetConfig<L, A>>
    }
  ) => HKT2<F, Env, Array<L>, Set<A>>
}

export interface MatechsAlgebraSet1<F extends URIS, Env extends AnyEnv> {
  _F: F
  set: <A>(
    a: Kind<F, Env, A>,
    ord: Ord<A>,
    config?: {
      name?: string
      conf?: ConfigsForType<Env, Array<unknown>, Set<A>, SetConfig<unknown, A>>
    }
  ) => Kind<F, Env, Set<A>>
}

export interface MatechsAlgebraSet2<F extends URIS2, Env extends AnyEnv> {
  _F: F
  set: <L, A>(
    a: Kind2<F, Env, L, A>,
    ord: Ord<A>,
    config?: {
      name?: string
      conf?: ConfigsForType<Env, Array<L>, Set<A>, SetConfig<L, A>>
    }
  ) => Kind2<F, Env, Array<L>, Set<A>>
}
