import React, { Component } from 'react';
import { notification } from 'antd';
import config from '../config';

export default class Notifications extends Component {
    componentWillMount = () => {
        fetch(`${config.server}/api/notifications`)
        .then(res => {
            if (res.ok) 
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                this.notify(json.notifications);
            }
        });
    }
    notify = (_notifications) => {
        for (let i = 0; i < _notifications.length; i++) {
            notification.info({
                message: _notifications[i].title,
                description: _notifications[i].msg,
                duration: null
            });
        }
    }
    render () {
        return (
            <div className="Notifications"></div>
        );
    }
}