import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link} from "react-router-dom";

import "./App.css";
import "./App.scss";

// importar las paginas
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ForgotPassword from "./pages/ForgotPassword";

import PaperBase from "./modules/users/Paperbase";


function App() {
  
  return (
    <div className="app">  
      <Router>                                       
        <div>
          <Switch>
            <Route exact path="/" component={Home} />          
            <Route path="/sign-in/" component={SignIn}/>
            <Route path="/sign-up/" component={SignUp}/>
            <Route path="/terms/" component={Terms}/>
            <Route path="/privacy/" component={Privacy}/>
            <Route path="/forgot-password/" component={ForgotPassword}/>
            <Route path="/paper-base/" component={PaperBase}/>
            <Redirect to="/"></Redirect>
          </Switch>    
        </div>
      </Router>
    </div>
  );
}

export default App;
