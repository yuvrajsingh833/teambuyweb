import { combineReducers } from "redux";
import rootReducer from "./rootReducer";

const appReducer = combineReducers({
    userData: rootReducer
});

export default appReducer;
