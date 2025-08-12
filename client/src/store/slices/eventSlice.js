import { createSlice } from '@reduxjs/toolkit';
import { isAfter } from 'date-fns';
import {
  decorateAsyncThunk,
  pendingReducer,
  rejectedReducer,
} from '../../utils/store';

const EVENT_SLICE_NAME = 'event';

const loadEvents = (userId) =>
  JSON.parse(localStorage.getItem(`${EVENT_SLICE_NAME}_${userId}`)) ?? [];

const saveEvents = (events, userId) => {
  localStorage.setItem(`${EVENT_SLICE_NAME}_${userId}`, JSON.stringify(events));
};

const initialState = {
  isFetching: false,
  events: [],
  finishedCount: 0,
  reminderCount: 0,
  error: null,
};

export const getEventsAsync = decorateAsyncThunk({
  key: `${EVENT_SLICE_NAME}/getEvents`,
  thunk: async (userId) => {
    return loadEvents(userId);
  },
});

export const addEventAsync = decorateAsyncThunk({
  key: `${EVENT_SLICE_NAME}/addEvent`,
  thunk: async ({ event, userId  }) => {
    const events = loadEvents(userId);
    const newEvents = [...events, { ...event }];
    saveEvents(newEvents, userId);
    return newEvents;
  },
});

export const deleteEventAsync = decorateAsyncThunk({
  key: `${EVENT_SLICE_NAME}/deleteEvent`,
  thunk: async ({ eventId, userId }) => {
    const events = loadEvents(userId);
    const newEvents = events.filter((event) => event.id !== eventId);
    saveEvents(newEvents);
    return newEvents;
  },
});

const extraReducers = (builder) => {
  builder.addCase(getEventsAsync.pending, pendingReducer);
  builder.addCase(getEventsAsync.fulfilled, (state, { payload }) => {
    state.events = payload;
  });
  builder.addCase(getEventsAsync.rejected, rejectedReducer);

  builder.addCase(addEventAsync.pending, pendingReducer);
  builder.addCase(addEventAsync.fulfilled, (state, { payload }) => {
    state.events = payload;
  });
  builder.addCase(addEventAsync.rejected, rejectedReducer);

  builder.addCase(deleteEventAsync.pending, pendingReducer);
  builder.addCase(deleteEventAsync.fulfilled, (state, { payload }) => {
    state.events = payload;
  });
  builder.addCase(deleteEventAsync.rejected, rejectedReducer);
};

const reducers = {
  checkTime: (state) => {
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
  extraReducers,
});

const { actions, reducer } = eventSlice;

export const { addEvent, deleteEvent, checkTime } = actions;

export default reducer;
