import { createSlice } from '@reduxjs/toolkit';
import CONSTANTS from '../../constants';

const USER_PROFILE_SLICE_NAME = 'userProfile';

const initialState = {
  profileViewMode: CONSTANTS.USER_INFO_MODE,
  isEdit: false,
};

const reducers = {
  changeProfileViewMode: (state, { payload }) => {
    state.profileViewMode = payload;
  },
  changeEditModeOnUserProfile: (state, { payload }) => {
    state.isEdit = payload;
  },
  resetState: (state) => {
    state.profileViewMode = CONSTANTS.USER_INFO_MODE;
    state.isEdit = false;
  },
};

const userProfileSlice = createSlice({
  name: USER_PROFILE_SLICE_NAME,
  initialState,
  reducers,
});

const { actions, reducer } = userProfileSlice;

export const { changeProfileViewMode, changeEditModeOnUserProfile, resetState } = actions;

export default reducer;
