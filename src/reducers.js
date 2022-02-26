import { combineReducers } from "redux";
import boardReducerSlice from "./redux/reducers";

const rootReducers = combineReducers({
  board: boardReducerSlice,
});

export default rootReducers;
