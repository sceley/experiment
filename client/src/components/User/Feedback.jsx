import React, { Component } from 'react';
import { Input, Card, Button } from 'antd';
import config from '../../config';
const { TextArea } = Input;
export default class Feedback extends Component {
    handleSubmit = () => {
        const message = this.refs.message.textAreaRef.value;
        const body = {
            message
        };
        fetch(`${config.server}/api/user/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.user_token
            },
            body: JSON.stringify(body)
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(json => {
            if (json && !json.err) {
                message.info(json.msg);
            } else if (json && json.err) {
                message.error(json.msg);
            }
        });
    }
    render () {
        return (
            <div className="Feedback Container">
                <Card
                    title="反馈"
                >
                    <TextArea ref="message" rows={10} />
                    <div style={{textAlign: 'center', marginTop: 20}}>
                        <Button onClick={this.handleSubmit} type="primary">提交</Button>
                    </div>
                </Card>
            </div>
        );
    }
}