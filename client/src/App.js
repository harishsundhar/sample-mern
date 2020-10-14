import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import Landing from './component/layout/Landing';
import Navbar from './component/layout/Navbar';
import Login from './component/auth/login';
import Register from './component/auth/register';

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component= {Landing} />
      <section class="container">
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
      </section>
    </Fragment>
  </Router>
);
 

export default App;
