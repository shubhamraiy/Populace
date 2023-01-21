import {CombinedState, combineReducers} from '@reduxjs/toolkit';

import ecomOrderRevertBackWithoutPayReducer from '@redux/ecomOrderRevertBackWithoutPay/reducer'
//Please dont remove @redux
const appReducer = combineReducers({

    ecomOrderRevertBackWithoutPayReducer,
});
const DESTROY_SESSION = 'DESTROY_SESSION';

const MainReducer = (
    state:
        | CombinedState<{
       
       
        ecomOrderRevertBackWithoutPayReducer:any
    }>
        | undefined,
    action: any,
) => {
    // Clear all data in redux store to initial.
    if (action.type === DESTROY_SESSION) {
        state = undefined;
    }

    return appReducer(state, action);
};
export default MainReducer;
