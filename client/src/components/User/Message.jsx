import React, { Component } from 'react';
import { Card, List } from 'antd';
import moment from 'moment';
import config from '../../config';
export default class Message extends Component {
    state = {
        replys: []
    }
    componentWillMount = () => {
        fetch(`${config.server}/api/feedback/reply`)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(json => {
            if (json && !json.err) {
                this.setState({
                    replys: json.replys
                });
            }
        });
    }
    render () {
        return (
            <div className="Message Container">
                <Card
                    title="消息通知"
                >
                    <List
                        bordered
                        dataSource={this.state.replys}
                        renderItem={item => (
                            <List.Item>
                                你在
                                <em style={{margin: '0 5px'}}>{moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')}</em>
                                发的：
                                <em style={{ margin: '0 5px' }}>{item.message}</em>
                                得到反馈了：
                                {item.reply}
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        );
    }
}