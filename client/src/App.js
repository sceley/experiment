import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Layout } from 'antd';
import PowerSwitch from './components/PowerSwitch/PowerSwitch';
import Nav from './components/Nav/Nav';
import Person from './components/Person/Person';
import Admin from './components/Admin/Admin';
import Home from './components/Home/Home';
import Evaluation from './components/Evaluation/Evaluation';
import './App.css';
const { Header, Footer, Content, Sider } = Layout;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
            <Layout>
                <Header className="App-header">
                    <Nav/>
                </Header>
                <Content className="App-body">
                    <Route exact path="/" component={Home}/>
                    <Route path="/person" component={Person}/>
                    <Route path="/admin" component={Admin}/>
                    <Route path="/evaluation" component={Evaluation}/>
                </Content>
            </Layout>
         </Router>
      </div>
    );
  }
}

export default App;
