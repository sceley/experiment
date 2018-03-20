import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Layout } from 'antd';
import User from './components/User/User';
import Admin from './components/Admin/Admin';
import Login from './components/Login/Login';
import Logup from './components/Logup/Logup';
import AdminLogin from './components/Admin-Login/Login';
import './App.css';
const { Header, Footer, Content, Sider } = Layout;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/user/login" component={Login}/>
            <Route path="/user/logup" component={Logup}/>
            <Route path="/admin/login" component={AdminLogin}/>
            <Route path="/user" component={User}/>
            <Route path="/admin" component={Admin}/>
          </Switch>
         </Router>
      </div>
    );
  }
}

export default App;
