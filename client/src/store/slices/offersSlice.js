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
  haveMore: false,
  offers: [],
};

export const getOffers = decorateAsyncThunk({
  key: `${OFFERS_SLICE_NAME}/getOffers`,
  thunk: async (payload) => {
    const { data } = await restController.getOffers(payload);
    return data;
  },
});

export const updateOffer = decorateAsyncThunk({
  key: `${OFFERS_SLICE_NAME}/updateOffer`,
  thunk: async (payload) => {
    const { data } = await restController.updateOffer(payload);
    return data
   }
})

const getOffersExtraReducers = createExtraReducers({
  thunk: getOffers,
  pendingReducer: (state) => {
    state.isFetching = true;
    state.error = null;
  },
  fulfilledReducer: (state, { payload }) => {
    state.isFetching = false;
    state.offers = [...state.offers, ...payload.offers];
    state.haveMore = payload.haveMore;
    state.error = null;
  },
  rejectedReducer,
});

const updateOfferExtraReducers = createExtraReducers({
  thunk: updateOffer,
  pendingReducer: (state) => {
    state.isFetcing = true;
    state.error = null;
  },
  fulfilledReducer: (state, { payload }) => {
    state.isFetching = false;
    state.offers = state.offers.filter(offer => offer.id !== payload.id);
    state.error = null;
  },
  rejectedReducer
})

const extraReducers = (builder) => {
  getOffersExtraReducers(builder);
  updateOfferExtraReducers(builder)
};

const offersSlice = createSlice({
  name: OFFERS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers,
});

const { actions, reducer } = offersSlice;

export default reducer;
