import { put, takeEvery, call, select } from "@redux-saga/core/effects";
import axios from "axios";
import { endpoint_url } from "../assets/constants";
import {
  create_row,
  create_row_success,
  create_tickets,
  create_tickets_success,
  delete_row,
  delete_row_success,
  error_call,
  fetch_rows,
  fetch_rows_success,
  reorder_tickets,
} from "./reducers";
import { getRows } from "./selectors";

function* fetchRows() {
  try {
    const { data } = yield call(axios.get, `${endpoint_url}/rows`);
    console.log({ data });
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
    yield put({
      type: create_row_success.type,
      payload: { ...data, tickets: [] },
    });
  } catch (error) {
    yield put({ type: error_call.type, payload: error });
  }
}

function* deleteRow({ payload }) {
  try {
    const rows = yield select(getRows);
    const row = rows.find((x) => x.id === payload.id);
    yield call(axios.delete, `${endpoint_url}/rows/${payload.id}`);
    const { data } = yield call(
      axios.get,
      `${endpoint_url}/tickets?rowid=${row.rowid}`
    );
    for (const ticket of data) {
      yield call(axios.delete, `${endpoint_url}/tickets/${ticket.id}`);
    }
    yield put({ type: delete_row_success.type, payload });
  } catch (error) {
    yield put({ type: error_call.type, payload: error });
  }
}

function* createTicket({ payload }) {
  try {
    const { data } = yield call(axios.post, `${endpoint_url}/tickets`, payload);
    yield put({ type: create_tickets_success.type, payload: data });
  } catch (error) {
    yield put({ type: error_call.type, payload: error });
  }
}

function* reorderTicket({ payload }) {
  console.log({ payload });
  try {
  } catch (error) {
    yield put({ type: error_call.type, payload: error });
  }
}

function* boardSagas() {
  yield takeEvery(fetch_rows.type, fetchRows);
  yield takeEvery(create_row.type, createRow);
  yield takeEvery(delete_row.type, deleteRow);
  yield takeEvery(create_tickets.type, createTicket);
  yield takeEvery(reorder_tickets.type, reorderTicket);
}

export default boardSagas;
