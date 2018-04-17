import React, { Component } from 'react';
import { notification, Icon, Button } from 'antd';
import config from '../config';
import logo from '../logo.png';
import moment from 'moment';
import Markdown from 'markdown-it';
const md = new Markdown();
export default class Notify extends Component {
    state = {
        notification: ''
    }
    componentWillMount = () => {
        notification.destroy();
        const id = this.props.match.params.id;
        fetch(`${config.server}/api/notification/details/${id}`)
            .then(res => {
                if (res.ok)
                    return res.json();
            }).then(json => {
                if (json && !json.err) {
                    this.setState({
                        notification: json.notification[0]
                    });
                }
            });
    }
    handleRollback = () => {
        this.props.history.goBack();
    }
    render() {
        return (
            <div className="Notification">
                <div className="log-logo-wrap">
                    <img className="log-logo" src={logo} alt="logo" />
                </div>
                <div style={{ width: 800, margin: '30px auto' }} className="artile">
                    <h1>{this.state.notification.title}</h1>
                    <ul className="extra-list">
                        <li className="extra-list-item">
                            <em>时间：</em>
                            <em>
                                {moment(this.state.notification.createAt).format("YYYY-MM-DD HH:mm:ss")}
                            </em>
                        </li>
                        <li className="extra-list-item">
                            <em>作者：</em>
                            <em>{this.state.notification.author}</em>
                        </li>
                    </ul>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: md.render(this.state.notification.msg || '')
                        }}
                        style={{ marginTop: 20 }}
                    >
                    </div>
                </div>
                <div style={{  padding: '20px 0 100px 0', fontSize: 20 , textAlign: 'center' }}>
                    <Button onClick={this.handleRollback}>
                        返回<Icon style={{}} type="rollback" />
                    </Button>
                </div>
            </div>
        );
    }
}