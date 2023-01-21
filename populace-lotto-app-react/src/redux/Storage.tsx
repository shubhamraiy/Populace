import {applyMiddleware, configureStore} from '@reduxjs/toolkit';
import MainReducer from './MainReducer';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

export let store: null | any = null;

export default (initialState?: any) => {
  if (store !== null) {
    return store;
  }

  store = configureStore(
    MainReducer,
    initialState,
    applyMiddleware(thunk, logger),
  );
  return store;
};
