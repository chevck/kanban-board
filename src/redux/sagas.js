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
  fetch_ticket,
  fetch_ticket_success,
  reorder_tickets,
  reorder_tickets_success,
} from "./reducers";
import { getRows } from "./selectors";

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
    let { data: tickets } = yield call(axios.get, `${endpoint_url}/tickets`);
    let rowid = "";
    const sourceticket = tickets[payload.source.index];
    const destinationticket = tickets[payload.destination.index];
    yield call(
      axios.put,
      `${endpoint_url}/tickets/${sourceticket.id}`,
      destinationticket
    );
    yield call(
      axios.put,
      `${endpoint_url}/tickets/${sourceticket.id}`,
      sourceticket
    );
    const { data } = yield call(axios.get, `${endpoint_url}/tickets`);
    console.log("mnewwww,", data);
    if (sourceticket.rowid === destinationticket.rowid) {
      rowid = sourceticket.rowid;
    }
    yield put({
      type: reorder_tickets_success.type,
      payload: { res: data, rowid },
    });
  } catch (error) {
    yield put({ type: error_call.type, payload: error });
  }
}

function* getATicket({ payload }) {
  try {
    const { data } = yield call(
      axios.get,
      `${endpoint_url}/tickets/${payload.id}`
    );
    yield put({ type: fetch_ticket_success.type, payload: data });
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
  yield takeEvery(fetch_ticket.type, getATicket);
}

export default boardSagas;
