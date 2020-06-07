import type { InterpreterURI, InterpreterResult } from "../interpreter-result"
import { materialize, Materialized } from "../materializer"
import { InferredProgram, Overloads, Define, defineFor } from "../program-infer"
import type { ProgramURI, ProgramType } from "../program-type"
import { makeTagged, TaggedBuilder } from "../tagged-union"

import type { AnyEnv } from "@matechs/morphic-alg/config"
import type { CacheType } from "@matechs/morphic-alg/utils/core"
import type { URIS, URIS2 } from "@matechs/morphic-alg/utils/hkt"

export interface Summoners<
  ProgURI extends ProgramURI,
  InterpURI extends InterpreterURI,
  R extends AnyConfigEnv
> {
  <L, A>(F: InferredProgram<R, L, A, ProgURI>): Materialized<
    R,
    L,
    A,
    ProgURI,
    InterpURI
  >
  _P: ProgURI
  _I: InterpURI
  _R: (_: R) => void
}

export type SummonerProgURI<X extends Summoners<any, any, any>> = NonNullable<X["_P"]>

export type SummonerInterpURI<X extends Summoners<any, any, any>> = NonNullable<X["_I"]>

export type SummonerEnv<X extends Summoners<any, any, any>> = NonNullable<
  Parameters<X["_R"]>[0]
>

export interface MakeSummonerResult<S extends Summoners<any, any, any>> {
  summon: S
  tagged: TaggedBuilder<SummonerProgURI<S>, SummonerInterpURI<S>, SummonerEnv<S>>
}

export interface SummonerOps<S extends Summoners<any, any, any> = never> {
  make: S
  makeADT: TaggedBuilder<SummonerProgURI<S>, SummonerInterpURI<S>, SummonerEnv<S>>
  makeProgram: Define<SummonerProgURI<S>, SummonerEnv<S>>
}

export function makeSummoner<S extends Summoners<any, any, any> = never>(
  cacheProgramEval: CacheType,
  programInterpreter: <E, A>(
    program: Overloads<ProgramType<SummonerEnv<S>, E, A>[SummonerProgURI<S>]>
  ) => InterpreterResult<E, A>[SummonerInterpURI<S>]
): SummonerOps<S> {
  type PURI = SummonerProgURI<S>
  type InterpURI = SummonerInterpURI<S>
  type Env = SummonerEnv<S>

  type P<L, A> = ProgramType<Env, L, A>[PURI]
  type M<L, A> = Materialized<Env, L, A, PURI, InterpURI>

  const summon = (<L, A>(F: P<L, A>): M<L, A> =>
    materialize(
      cacheProgramEval(F),
      programInterpreter as <E, A>(
        program: P<E, A>
      ) => InterpreterResult<E, A>[InterpURI]
    )) as S
  const tagged: TaggedBuilder<PURI, InterpURI, SummonerEnv<S>> = makeTagged(summon)
  const define = defineFor<PURI>(undefined as PURI)<Env>()
  return {
    make: summon,
    makeADT: tagged,
    makeProgram: define
  }
}

export type ExtractEnv<Env, SummonerEnv extends URIS | URIS2> = {
  [k in SummonerEnv & keyof Env]: NonNullable<Env>[k & keyof Env]
}

export type AnyConfigEnv = AnyEnv