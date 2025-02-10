import {
  createExtraReducers,
  decorateAsyncThunk,
  rejectedReducer,
} from '../../utils/store';
import * as restController from '../../api/rest/restController';
import { createSlice } from '@reduxjs/toolkit';

const OFFERS_SLICE_NAME = 'offers';

const initialState = {
  isFetching: true,
  error: null,
  offers: [],
};

export const getOffers = decorateAsyncThunk({
  key: `${OFFERS_SLICE_NAME}/getOffers`,
  thunk: async (payload) => {
    const { data } = await restController.getOffers();
    return data;
  },
});

const getOffersExtraReducers = createExtraReducers({
  thunk: getOffers,
  pendingReducer: (state) => {
    state.isFetcing = true;
    state.offers = [];
    state.error = null;
  },
  fulfilledReducer: (state, { payload }) => {
    state.isFetching = false;
    state.offers = payload;
    state.error = null;
  },
  rejectedReducer,
});

const extraReducers = (builder) => {
  getOffersExtraReducers(builder);
};

const offersSlice = createSlice({
  name: OFFERS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers,
});

const { actions, reducer } = offersSlice;

export default reducer;
