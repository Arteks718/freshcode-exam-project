import { createSlice } from '@reduxjs/toolkit';
import { isAfter } from 'date-fns';

const EVENT_SLICE_NAME = 'event';

const loadEvents = () =>
  JSON.parse(localStorage.getItem(EVENT_SLICE_NAME)) ?? [];
const saveEvents = (events) => {
  localStorage.setItem(EVENT_SLICE_NAME, JSON.stringify(events));
};

const initialState = {
  isFetching: true,
  events: JSON.parse(localStorage.getItem(EVENT_SLICE_NAME)) ?? [],
  finishedCount: 0,
  reminderCount: 0,
  error: null,
};

const reducers = {
  getEvents: (state) => {
    state.events = loadEvents();
  },
  addEvent: (state, { payload }) => {
    state.events = [...state.events, { ...payload }];
    saveEvents(state.events);
  },
  deleteEvent: (state, { payload }) => {
    state.events = state.events.filter((event) => event.id !== payload);
    saveEvents(state.events);

    state.finishedCount = state.events.filter((event) =>
      isAfter(Date.now() + 1, event.finishDate)
    ).length;
    state.reminderCount = state.events.filter((event) => {
      const isOver = isAfter(Date.now() + 1, event.finishDate);
      const isRemind = isAfter(Date.now() + 1, event.reminderDate);
      return isRemind && !isOver;
    }).length;
  },
  checkTime: (state, { payload }) => {
    state.finishedCount = state.events.filter((event) =>
      isAfter(new Date(), new Date(event.finishDate))
    ).length;
    state.reminderCount = state.events.filter((event) => {
      const isOver = isAfter(new Date(), new Date(event.finishDate));
      const isRemind = isAfter(new Date(), new Date(event.reminderDate));
      return isRemind && !isOver;
    }).length;
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
