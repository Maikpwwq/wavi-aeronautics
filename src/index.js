import React from "react";
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk' 
import { composeWithDevTools } from '@redux-devtools/extension';
import reducer from './reducers/reducers';

import App from "./App";

// Create a browser
let history = createBrowserHistory()
history.listen((location, action) => {
    // this is called whenever new locations come in
    // the action is POP, PUSH, or REPLACE
    console.log(location, action)
})
const composeEnhancers = composeWithDevTools(applyMiddleware(thunkMiddleware)) || compose;
const store = createStore(reducer, window.__PRELOADED_STATE__, composeEnhancers());
delete window.__PRELOADED_STATE__;

// SSR
const containerReactApp = document.getElementById('root');
const root = hydrateRoot(containerReactApp,
  <Provider store={store}> 
    <Router history={history}>
      <App />
    </Router>
  </Provider>
);
