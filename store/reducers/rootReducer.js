import { ActionTypes } from "../types";

const initialState = {
    userData: {
        defaultLanguage: 'english',
        userData: {},
    }
};

const userData = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.SET_LOGGED_IN_USER_DATA:
            return action.data;
        case ActionTypes.SET_GUEST_USER_DATA:
            return action.data;
        case ActionTypes.UPDATE_DEVICE_TOKEN:
            return { ...state, deviceToken: action.data };
        case ActionTypes.UPDATE_USER_DATA:
            return { ...state, ...action.data };
        case ActionTypes.UPDATE_GUEST_USER_DATA:
            return { ...state, ...action.data };
        default:
            return state;
    }
};

const defaultLanguage = (state = 'english', action) => {
    switch (action.type) {
        case ActionTypes.SET_APP_DEFAULT_LANGUAGE:
            return action.data;
        default:
            return state;
    }
};

const rootReducer = (state = initialState, action) => {

    let newState = {
        userData: userData(state.userData, action),
        defaultLanguage: defaultLanguage(state.defaultLanguage, action),
    };

    if (action.type == ActionTypes.SET_INITIAL_STATE) {
        newState = Object.assign(newState, action.data);
    }
    return newState;
};


export default rootReducer;