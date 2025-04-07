import { createSlice } from '@reduxjs/toolkit';
import { isAfter } from 'date-fns';

const EVENT_SLICE_NAME = 'event';

const initialState = {
  isFetching: true,
  events: JSON.parse(localStorage.getItem(EVENT_SLICE_NAME)) ?? [],
  finishedCount: 0,
  reminderCount: 0,
  error: null,
};

const reducers = {
  addEvent: (state, { payload }) => {
    state.events.push({ ...payload });
    localStorage.setItem(EVENT_SLICE_NAME, JSON.stringify(state.events));
  },
  deleteEvent: (state, { payload }) => {
    state.events = state.events.filter((event) => event.id !== payload);
    localStorage.setItem(EVENT_SLICE_NAME, JSON.stringify(state.events));
    if(state.finishedCount > 0) state.finishedCount--
    if(state.reminderCount > 0) state.reminderCount--
    // state.finishedCount--
    // state.reminderCount--
  },
  checkTime: (state, { payload }) => {
    const currentTime = payload;
    state.finishedCount = 0;
    state.reminderCount = 0;
    state.events.forEach((event) => {
      const isOver = isAfter(currentTime + 1, event.finishDate),
        isRemind = isAfter(currentTime + 1, event.reminderDate);

      if(isOver) state.finishedCount++;
      if(isRemind && !isOver) state.reminderCount++;
    });
  },
};

const eventSlice = createSlice({
  name: EVENT_SLICE_NAME,
  initialState,
  reducers,
});

const { actions, reducer } = eventSlice;

export const { getEvents, addEvent, deleteEvent, checkTime } = actions;

export default reducer;
