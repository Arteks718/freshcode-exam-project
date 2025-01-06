import { createSlice } from "@reduxjs/toolkit";
import { decorateAsyncThunk } from "../../utils/store";

const EVENT_SLICE_NAME = 'event'

const initialState = {
  isFetching: true,
  events: JSON.parse(localStorage.getItem(EVENT_SLICE_NAME)) ?? [],
  error: null
}

const reducers = {
  addEvent: (state, { payload }) => {
    state.events.push({ ...payload });
    localStorage.setItem(EVENT_SLICE_NAME, JSON.stringify(state.events));
  },
  deleteEvent: (state, { payload }) => {
    state.events = state.events.filter((event) => event.id !== payload);
    localStorage.setItem(EVENT_SLICE_NAME, JSON.stringify(state.events));
  }
}

const eventSlice = createSlice({
  name: EVENT_SLICE_NAME,
  initialState,
  reducers,
})

const { actions, reducer } = eventSlice;

export const { getEvents, addEvent, deleteEvent } = actions;

export default reducer;