import React, { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './component/layout/Landing';
import Navbar from './component/layout/Navbar';
import Routes from './component/routing/Routes';
//redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './util/setAuthToken';
import { loadUser } from './actions/auth';


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => { 

    useEffect(() => {
      store.dispatch(loadUser());
    }, []);


  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={ Landing } />
            <Route component={Routes} />
          </Switch> 
        </Fragment>
      </Router>
    </Provider>
  )};


export default App;
