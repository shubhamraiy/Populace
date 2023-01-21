import * as types from './actionTypes';
import initialState from './initialState';

export default (state = initialState, action: any) => {
  switch (action.type) {
    case types.FETCHING_DATA:
      return {
        ...state,
        isLoading: true,
        message: null,
        data: null,
      };

    case types.FETCHING_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        message: null,
        data: action.data,
      };
    case types.FETCHING_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        message: action.message,
        data: null,
      };
    case types.RESET_DATA:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
