import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
// Redux
import { Provider } from 'react-redux'; // Surround app with Provider to blend React with Redux
import store from './store';

const App = () =>
<Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={ Landing } />
        <section className="container">
          <Switch>
            <Route path="/register" component={ Register }/>
            <Route path="/login" component={ Login }/>
          </Switch>
        </section>
      </Fragment>
    </Router>
</Provider>
export default App;
