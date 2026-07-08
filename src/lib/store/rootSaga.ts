import { all } from "redux-saga/effects";
import { schedulingSaga } from "@/features/scheduling/store/schedulingSaga";

export function* rootSaga() {
  yield all([schedulingSaga()]);
}
