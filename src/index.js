import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import ConfigureAppStore from "./store/index";
// import { createStore, compose, applyMiddleware } from 'redux'
// import thunkMiddleware from 'redux-thunk'
// import { composeWithDevTools } from '@redux-devtools/extension';

import App from "./App";

// Create a browser
let history = createBrowserHistory();
history.listen((location, action) => {
  // this is called whenever new locations come in
  // the action is POP, PUSH, or REPLACE
  console.log(location, action);
});
// The redux-dev-tools and redux-thunk are already included in redux-toolkit.
// const composeEnhancers = composeWithDevTools(applyMiddleware(thunkMiddleware)) || compose;
// const store = createStore(reducer, window.__PRELOADED_STATE__, composeEnhancers());
const preloadState = window.__PRELOADED_STATE__;
// const store = configureStore({
//   reducer: reducer,
//   preloadState,
// });
const store = ConfigureAppStore(preloadState)
delete window.__PRELOADED_STATE__;

// SSR
const containerReactApp = document.getElementById("root");
const root = hydrateRoot(
  containerReactApp,
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
);
