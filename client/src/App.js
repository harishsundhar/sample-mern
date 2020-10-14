import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './component/layout/Landing';
import Navbar from './component/layout/Navbar';
import Login from './component/auth/login';
import Register from './component/auth/register';
import Alert from './component/layout/Alert';
//redux
import { Provider } from 'react-redux';
import store from './store';



const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert/>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);


export default App;
