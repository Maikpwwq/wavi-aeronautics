import * as firebase from 'firebase/app';
import React from "react";
import ReactDOM from "react-dom";
//import { FirebaseAuthProvider } from "use-firebase-auth";
import "firebase/auth";

import App from "./App";

ReactDOM.render(
    <App />,
  document.getElementById("root")
);

{/* <FirebaseAuthProvider firebase={firebase}>
    <App />
  </FirebaseAuthProvider>,  */}