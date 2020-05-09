import { SET_FILTER, REMOVE_FILTER } from "../types";

export default (state, action) => {
  switch (action.type) {
    case SET_FILTER:
      return [...state, action.payload];
    case REMOVE_FILTER:
      return state.filter(alert => alert.id !== action.payload.id);
    default:
      return state;
  }
};
