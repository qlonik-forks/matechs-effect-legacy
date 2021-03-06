/**
 * Ported from https://github.com/zio/zio/blob/master/core/shared/src/main/scala/zio/ZRef.scala
 *
 * Copyright 2020 Michael Arnaldi and the Matechs Garage Contributors.
 */
export { ERef, Ref, XRef } from "./XRef"

export {
  collect,
  contramap,
  contramapEither,
  dimap,
  dimapEither,
  dimapError,
  filterInput,
  filterOutput,
  fold,
  foldAll,
  get,
  getAndSet,
  getAndUpdate,
  getAndUpdateSome,
  makeRef,
  unsafeMakeRef,
  map,
  mapEither,
  modify,
  modifySome,
  readOnly,
  set,
  unsafeUpdate,
  update,
  updateAndGet,
  updateSome,
  updateSomeAndGet,
  writeOnly,
  collect_,
  contramapEither_,
  contramap_,
  dimapEither_,
  dimapError_,
  dimap_,
  filterInput_,
  filterOutput_,
  foldAll_,
  fold_,
  getAndSet_,
  getAndUpdateSome_,
  getAndUpdate_,
  mapEither_,
  map_,
  modifySome_,
  modify_,
  set_,
  unsafeUpdate_,
  updateAndGet_,
  updateSomeAndGet_,
  updateSome_,
  update_
} from "./api"

export { makeManagedRef } from "./makeManagedRef"
