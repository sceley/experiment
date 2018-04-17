import React, { Component } from 'react';
import { notification } from 'antd';
import config from '../config';

export default class Notify extends Component {
    componentDidMount = () => {
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
    go = (url) => {
        this.props.history.push(url);
    }
    notify = (data) => {
        data.forEach(item => {
            notification.info({
                message: 
                        <a onClick={() => this.go(`/notification/details/${item.id}`)}>
                            {item.title}
                        </a>,
                duration: null
            });
        });
    }
    render () {
        return (
            <div className="Notifications">

            </div>
        );
    }
}