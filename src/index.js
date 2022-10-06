import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
// import history from "./history";
import { createBrowserHistory as history } from "history";
import { Provider } from "react-redux";
import ConfigureAppStore from "./store/index";
// import { createStore, compose, applyMiddleware } from 'redux'
// import thunkMiddleware from 'redux-thunk'
// import { composeWithDevTools } from '@redux-devtools/extension';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevTools } from "react-query/devtools";
import App from "./App";

const queryClient = new QueryClient();
// Create a browser

// history.listen((location, action) => {
//   // this is called whenever new locations come in
//   // the action is POP, PUSH, or REPLACE
//   console.log(location, action);
// });

// The redux-dev-tools and redux-thunk are already included in redux-toolkit.
// const composeEnhancers = composeWithDevTools(applyMiddleware(thunkMiddleware)) || compose;
// const store = createStore(reducer, window.__PRELOADED_STATE__, composeEnhancers());
const preloadState = window.__PRELOADED_STATE__;
const store = ConfigureAppStore(preloadState);
delete window.__PRELOADED_STATE__;

// SSR
const containerReactApp = document.getElementById("root");
const root = hydrateRoot(
  containerReactApp,
  <Router history={history}>
    <Provider store={store}>
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <App />
        <ReactQueryDevTools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </Router>
);

// export default store;