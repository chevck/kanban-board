import { createSelector } from "@reduxjs/toolkit";

const boardData = (state = {}) => state.board;

export const getRows = createSelector(boardData, (board) => board.rows);

export const getTicket = createSelector(boardData, (board) => board.ticket);
