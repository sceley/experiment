import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Layout } from 'antd';
import PowerSwitch from './components/PowerSwitch/PowerSwitch';
import Nav from './common/Nav';
import './App.css';
const { Header, Footer, Content, Sider } = Layout;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
            <Header className="App-header">
                <h1>实验室管理系统</h1>
            </Header>
            <Router>
                <Layout className="App-body">
                    <Sider>
                        <Nav/>
                    </Sider>
                    <Content>
                        <Route path='/manage/powerswitch' component={PowerSwitch}/>
                    </Content>
                </Layout>
            </Router>
        </Layout>
      </div>
    );
  }
}

export default App;
