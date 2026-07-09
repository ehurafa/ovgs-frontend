import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./rootReducer";
import { rootSaga } from "./rootSaga";

export function createAppStore() {
  const sagaMiddleware = createSagaMiddleware();

  const appStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  });

  const task = sagaMiddleware.run(rootSaga);

  return { store: appStore, task };
}

const appInstance = createAppStore();
export const store = appInstance.store;
export type AppDispatch = typeof store.dispatch;
