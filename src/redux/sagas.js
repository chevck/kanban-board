import { put, takeEvery, call } from "@redux-saga/core/effects";
import axios from "axios";
import { endpoint_url } from "../assets/constants";
import {
  create_row,
  create_row_success,
  create_tickets,
  delete_row,
  delete_row_success,
  error_call,
  fetch_rows,
  fetch_rows_success,
} from "./reducers";

function* fetchRows() {
  try {
    const { data } = yield call(axios.get, `${endpoint_url}/rows`);
    let rows = [];
    for (const row of data) {
      const { data } = yield call(
        axios.get,
        `${endpoint_url}/tickets?rowid=${row.rowid}`
      );
      row.tickets = data;
      rows.push(row);
    }
    yield put({ type: fetch_rows_success.type, payload: rows });
  } catch (error) {
    yield put({ type: error_call.type, payload: error });
  }
}

function* createRow({ payload }) {
  try {
    const { data } = yield call(axios.post, `${endpoint_url}/rows`, payload);
    yield put({ type: create_row_success.type, payload: data });
  } catch (error) {
    yield put({ type: error_call.type, payload: error });
  }
}

function* deleteRow({ payload }) {
  try {
    yield call(axios.delete, `${endpoint_url}/rows/${payload.id}`);
    yield put({ type: delete_row_success.type, payload });
  } catch (error) {
    yield put({ type: error_call.type, payload: error });
  }
}

function* createTicket({ payload }) {
  try {
    const result = yield call(axios.post, `${endpoint_url}/tickets`, payload);
    console.log({ result });
  } catch (error) {}
}

function* boardSagas() {
  yield takeEvery(fetch_rows.type, fetchRows);
  yield takeEvery(create_row.type, createRow);
  yield takeEvery(delete_row.type, deleteRow);
  yield takeEvery(create_tickets.type, createTicket);
}

export default boardSagas;
