import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "./reducers";
import { ActionCreators } from "./actions/index";

import * as Utils from "../lib/utils"


// initial states here
const initialState = Utils.getStateAsyncStorage("appData");

// middleware
const middleware = [thunk];

// creating store
export const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

store.dispatch(ActionCreators.setInitialState(initialState))

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);