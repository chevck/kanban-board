import { all } from "redux-saga/effects";
import boardSagas from "./redux/sagas";

export default function* root() {
  yield all([boardSagas()]);
}
