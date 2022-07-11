import React, { useEffect, useState } from "react";

import '../styles/owl.carousel.css'
import '../styles/owl.theme.default.css'
import '../styles/bootstrap.min.css'
import '../styles/style.css'
import '../styles/responsive.css'
import '../styles/globals.css'

import Layout from '../component/layout';

import { applyMiddleware, createStore } from "redux";

import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
const middleware = [thunk]

import { Provider } from "react-redux";
import { ActionCreators } from "../actions/index";
import appReducer from "../reducers/index";
const store = createStore(appReducer, {}, composeWithDevTools(applyMiddleware(...middleware)))


global.userData = null;

function MyApp({ Component, pageProps }) {


  const [isReady, setIsReady] = useState(false);

  const initializeApp = async () => {
    let appUserData = {}
    // global.firstTimeAccess = await Utils.getStateAsyncStorage("firstTimeAccess");
    store.dispatch(ActionCreators.setInitialState(appUserData));
    global.userData = appUserData.userData;
    setIsReady(true);
  }

  useEffect(() => {
    initializeApp()
  })

  let appState = store.getState();
  let signedIn = false;
  try {
    signedIn = appState.appData.userData.token.length > 0 ? true : false;
  } catch (error) {
    signedIn = false;
  }

  return <Provider store={store}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </Provider>
}

export default MyApp
