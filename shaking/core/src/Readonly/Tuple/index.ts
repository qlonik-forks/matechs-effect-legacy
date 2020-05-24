/* adapted from https://github.com/gcanti/fp-ts */

import type {
  CApply2C,
  CApplicative2C,
  CChain2C,
  CMonad2C,
  CChainRec2C,
  CTraverse2,
  CApplicative,
  HKT,
  CSequence2,
  CSemigroupoid2,
  CBifunctor2,
  CComonad2,
  CFoldable2,
  CTraversable2,
  Traverse2
} from "../../Base"
import type { Either } from "../../Either"
import type { Monoid } from "../../Monoid"
import { pipe } from "../../Pipe"
import type { Semigroup } from "../../Semigroup"

export const URI = "@matechs/core/Readonly/Tuple"

export type URI = typeof URI

declare module "../../Base/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: readonly [A, E]
  }
}

export function fst<A, S>(sa: readonly [A, S]): A {
  return sa[0]
}

export function snd<A, S>(sa: readonly [A, S]): S {
  return sa[1]
}

export function swap<A, S>(sa: readonly [A, S]): readonly [S, A] {
  return [snd(sa), fst(sa)]
}

export const make = <A, S>(a: A, s: S): readonly [A, S] => {
  return [a, s]
}

export function ap<S>(S: Semigroup<S>) {
  return <A>(fa: readonly [A, S]) => <B>(
    fab: readonly [(a: A) => B, S]
  ): readonly [B, S] => [fst(fab)(fst(fa)), S.concat(snd(fab), snd(fa))]
}

export function ap_<S>(S: Semigroup<S>) {
  return <A, B>(
    fab: readonly [(a: A) => B, S],
    fa: readonly [A, S]
  ): readonly [B, S] => [fst(fab)(fst(fa)), S.concat(snd(fab), snd(fa))]
}

export function getApply<S>(S: Semigroup<S>): CApply2C<URI, S> {
  return {
    URI,
    _E: undefined as any,
    map,
    ap: ap(S)
  }
}

export const of = <S>(M: Monoid<S>) => <A>(a: A): readonly [A, S] => {
  return [a, M.empty]
}

export function getApplicative<S>(M: Monoid<S>): CApplicative2C<URI, S> {
  return {
    ...getApply(M),
    of: of(M)
  }
}

export function chain<S>(S: Semigroup<S>) {
  return <A, B>(f: (a: A) => readonly [B, S]) => (
    fa: readonly [A, S]
  ): readonly [B, S] => {
    const [b, s] = f(fst(fa))
    return [b, S.concat(snd(fa), s)]
  }
}

export function chain_<S>(S: Semigroup<S>) {
  return <A, B>(fa: readonly [A, S], f: (a: A) => readonly [B, S]): readonly [B, S] => {
    const [b, s] = f(fst(fa))
    return [b, S.concat(snd(fa), s)]
  }
}

export function getChain<S>(S: Semigroup<S>): CChain2C<URI, S> & CApply2C<URI, S> {
  return {
    ...getApply(S),
    chain: chain(S)
  }
}

export function getMonad<S>(M: Monoid<S>): CMonad2C<URI, S> & CApplicative2C<URI, S> {
  return {
    ...getChain(M),
    of: of(M)
  }
}

export function getChainRec<S>(
  M: Monoid<S>
): CChainRec2C<URI, S> & CApplicative2C<URI, S> {
  return {
    ...getMonad(M),
    chainRec: chainRec(M)
  }
}

export function chainRec<S>(M: Monoid<S>) {
  return <A, B>(a: A, f: (a: A) => readonly [Either<A, B>, S]): readonly [B, S] => {
    let result: readonly [Either<A, B>, S] = f(a)
    let acc: S = M.empty
    let s: Either<A, B> = fst(result)
    while (s._tag === "Left") {
      acc = M.concat(acc, snd(result))
      result = f(s.left)
      s = fst(result)
    }
    return [s.right, M.concat(acc, snd(result))]
  }
}

export const compose: <E, A>(
  la: readonly [A, E]
) => <B>(ab: readonly [B, A]) => readonly [B, E] = (ae) => (ba) => [fst(ba), snd(ae)]

export const compose_: <B, E, A>(
  ab: readonly [B, A],
  la: readonly [A, E]
) => readonly [B, E] = (ba, ae) => [fst(ba), snd(ae)]

export const traverse: CTraverse2<URI> = <F>(F: CApplicative<F>) => <A, B>(
  f: (a: A) => HKT<F, B>
): (<S>(as: readonly [A, S]) => HKT<F, readonly [B, S]>) => {
  return (as) =>
    pipe(
      as,
      fst,
      f,
      F.map((b) => [b, snd(as)])
    )
}

export const traverse_: Traverse2<URI> = <F>(F: CApplicative<F>) => <S, A, B>(
  as: readonly [A, S],
  f: (a: A) => HKT<F, B>
): HKT<F, readonly [B, S]> => {
  return pipe(
    as,
    fst,
    f,
    F.map((b) => [b, snd(as)])
  )
}

export const sequence: CSequence2<URI> = <F>(F: CApplicative<F>) => <A, S>(
  fas: readonly [HKT<F, A>, S]
): HKT<F, readonly [A, S]> => {
  return pipe(
    fas,
    fst,
    F.map((a) => [a, snd(fas)])
  )
}

export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: readonly [A, E]) => readonly [B, G] = (f, g) => (fa) => [
  g(fst(fa)),
  f(snd(fa))
]

export const bimap_: <E, G, A, B>(
  fa: readonly [A, E],
  f: (e: E) => G,
  g: (a: A) => B
) => readonly [B, G] = (fa, f, g) => [g(fst(fa)), f(snd(fa))]

export const extend: <E, A, B>(
  f: (fa: readonly [A, E]) => B
) => (ma: readonly [A, E]) => readonly [B, E] = (f) => (fa) => [f(fa), snd(fa)]

export const extend_: <E, A, B>(
  ma: readonly [A, E],
  f: (fa: readonly [A, E]) => B
) => readonly [B, E] = (fa, f) => [f(fa), snd(fa)]

export const duplicate: <E, A>(ma: readonly [A, E]) => readonly [readonly [A, E], E] = (
  ma
) => extend_(ma, (x) => x)

export const foldMap: <M>(
  M: Monoid<M>
) => <A>(f: (a: A) => M) => <E>(fa: readonly [A, E]) => M = () => (f) => (fa) =>
  f(fst(fa))

export const foldMap_: <M>(
  M: Monoid<M>
) => <A, E>(fa: readonly [A, E], f: (a: A) => M) => M = () => (fa, f) => f(fst(fa))

export const map: <A, B>(
  f: (a: A) => B
) => <E>(fa: readonly [A, E]) => readonly [B, E] = (f) => (fa) => [f(fst(fa)), snd(fa)]

export const map_: <A, E, B>(fa: readonly [A, E], f: (a: A) => B) => readonly [B, E] = (
  fa,
  f
) => [f(fst(fa)), snd(fa)]

export const mapLeft: <E, G>(
  f: (e: E) => G
) => <A>(fa: readonly [A, E]) => readonly [A, G] = (f) => (fa) => [fst(fa), f(snd(fa))]

export const mapLeft_: <A, E, G>(
  fa: readonly [A, E],
  f: (e: E) => G
) => readonly [A, G] = (fa, f) => [fst(fa), f(snd(fa))]

export const reduce: <A, B>(
  b: B,
  f: (b: B, a: A) => B
) => <E>(fa: readonly [A, E]) => B = (b, f) => (fa) => f(b, fst(fa))

export const reduce_: <A, E, B>(
  fa: readonly [A, E],
  b: B,
  f: (b: B, a: A) => B
) => B = (fa, b, f) => f(b, fst(fa))

export const reduceRight: <A, B>(
  b: B,
  f: (a: A, b: B) => B
) => <E>(fa: readonly [A, E]) => B = (b, f) => (fa) => f(fst(fa), b)

export const reduceRight_: <A, E, B>(
  fa: readonly [A, E],
  b: B,
  f: (a: A, b: B) => B
) => B = (fa, b, f) => f(fst(fa), b)

export const readonlyTuple: CSemigroupoid2<URI> &
  CBifunctor2<URI> &
  CComonad2<URI> &
  CFoldable2<URI> &
  CTraversable2<URI> = {
  URI,
  compose,
  map,
  bimap,
  mapLeft,
  extract: fst,
  extend,
  reduce,
  foldMap,
  reduceRight,
  traverse,
  sequence
}
