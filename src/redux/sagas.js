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
  delete_ticket,
  error_call,
  fetch_rows,
  fetch_rows_success,
  fetch_ticket,
  fetch_ticket_success,
  move_ticket,
  move_ticket_success,
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
  try {
    const { data: tickets } = yield call(axios.get, `${endpoint_url}/tickets`);
    const sourceticket = tickets[payload.source.index];

    let rowid = sourceticket.rowid;
    const destinationticket = tickets[payload.destination.index];
    const rows = yield select(getRows);
    const rowIndex = rows.findIndex((row) => row.rowid === rowid);
    const row = rows[rowIndex];
    let newT = [...row.tickets];

    const [reorderedTicket] = newT.splice(payload.source.index, 1);
    newT.splice(payload.destination.index, 0, reorderedTicket);

    let newRow = { ...row, tickets: newT };
    yield put({
      type: reorder_tickets_success.type,
      payload: { newRow, rowIndex },
    });
    yield call(
      axios.put,
      `${endpoint_url}/tickets/${destinationticket.id}`,
      sourceticket
    );
    yield call(
      axios.put,
      `${endpoint_url}/tickets/${sourceticket.id}`,
      destinationticket
    );
  } catch (error) {
    yield put({ type: error_call.type, payload: error });
  }
}

function* moveTicket({ payload }) {
  try {
    const rows = yield select(getRows);
    const sourcerowIndex = rows.findIndex(
      (row) => row.rowid === payload.source.droppableId
    );
    const sourcerow = rows[sourcerowIndex];
    const destrowIndex = rows.findIndex(
      (row) => row.rowid === payload.destination.droppableId
    );
    const destrow = rows[destrowIndex];
    const movedTicket = sourcerow.tickets[payload.source.index];
    const { data: newmovedticket } = yield call(
      axios.put,
      `${endpoint_url}/tickets/${movedTicket.id}`,
      { ...movedTicket, rowid: destrow.rowid }
    );
    let sourceRowTickets = [...sourcerow.tickets];
    sourceRowTickets.splice(payload.source.index, 1);
    let destinationRowTickets = [...destrow.tickets];
    destinationRowTickets.splice(payload.destination.index, 0, newmovedticket);
    let result = {};
    result[sourcerowIndex] = { ...sourcerow, tickets: sourceRowTickets };
    result[destrowIndex] = { ...destrow, tickets: destinationRowTickets };
    yield put({
      type: move_ticket_success.type,
      payload: { result, sourcerowIndex, destrowIndex },
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

function* deleteTicket({ payload }) {
  try {
    yield call(axios.delete, `${endpoint_url}/tickets/${payload.id}`);
    yield call(fetchRows);
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
  yield takeEvery(delete_ticket.type, deleteTicket);
  yield takeEvery(move_ticket.type, moveTicket);
}

export default boardSagas;
