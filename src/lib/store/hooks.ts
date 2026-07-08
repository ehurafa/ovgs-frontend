import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "./rootReducer";
import type { AppDispatch } from "./store";

/**
 * Typed versions of the plain react-redux hooks. Use these instead of
 * the raw `useDispatch`/`useSelector` everywhere in the app, so state
 * shape and dispatched action types are always inferred correctly.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
