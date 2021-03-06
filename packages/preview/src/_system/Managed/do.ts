import { chain_, map_, succeedNow } from "./core"
import { Managed } from "./managed"

const bind = <S, R, E, A, K, N extends string>(
  tag: Exclude<N, keyof K>,
  f: (_: K) => Managed<S, R, E, A>
) => <S2, R2, E2>(
  mk: Managed<S2, R2, E2, K>
): Managed<S | S2, R & R2, E | E2, K & { [k in N]: A }> =>
  chain_(mk, (k) => map_(f(k), (a): K & { [k in N]: A } => ({ ...k, [tag]: a } as any)))

const merge = <S, R, E, A, K>(
  f: (_: K) => Managed<S, R, E, A & { [k in keyof K & keyof A]?: never }>
) => <S2, R2, E2>(mk: Managed<S2, R2, E2, K>): Managed<S | S2, R & R2, E | E2, K & A> =>
  chain_(mk, (k) => map_(f(k), (a): K & A => ({ ...k, ...a } as any)))

const let_ = <A, K, N extends string>(tag: Exclude<N, keyof K>, f: (_: K) => A) => <
  S2,
  R2,
  E2
>(
  mk: Managed<S2, R2, E2, K>
): Managed<S2, R2, E2, K & { [k in N]: A }> =>
  map_(mk, (k): K & { [k in N]: A } => ({ ...k, [tag]: f(k) } as any))

const of = succeedNow({})

export { let_ as let, bind, of, merge }
