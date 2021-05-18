import React, {Fragment, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

// components
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/login" render={props => !isAuthenticated? <Login{...props}/> : <Redirect to="/dashboard"/>} />
            <Route exact path="/register" render={props => !isAuthenticated? <Register{...props}/> : <Redirect to="/login"/>} />
            <Route exact path="/dashboard" render={props => <Dashboard{...props}/>} />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
