import React, { Component } from 'react';
import config from '../../config';
import { Card, List, Icon, Input, Modal, Button, message } from 'antd';
import moment from 'moment';
const { TextArea } = Input;
class Reply extends Component {
    handleSubmit = () => {
        const id = this.props.current_feedback_id;
        const value = this.refs.message.textAreaRef.value;
        const body = {
            message: value
        };
        fetch(`${config.server}/api/admin/feedback/${id}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.admin_token
            },
            body: JSON.stringify(body)
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(json => {
            if (json && !json.err) {
                message.info(json.msg);
                this.props.handleCancel();
            } else if (json && json.err) {
                message.error(json.msg);
            }
        });
    }
    render () {
        return (
            <div className="Reply">
                <TextArea ref="message" rows={5} />
                <div style={{textAlign: 'center', marginTop: 20}}>
                    <Button onClick={this.handleSubmit} type="primary">提交</Button>
                </div>
            </div>
        );
    }
}
export default class UserFeedback extends Component {
    state = {
        feedbacks: [],
        visible: false,
        current_feedback_id: ''
    }
    componentWillMount = () => {
        fetch(`${config.server}/api/feedback`)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(json => {
            if (json && !json.err) {
                this.setState({
                    feedbacks: json.feedbacks
                });
            }
        });
    }
    showModal = (id) => {
        this.setState({
            visible: true,
            current_feedback_id: id
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false
        });
    }
    render () {
        return (
            <div className="UserFeedback Container">
                <Card
                    title="用户反馈"
                >
                    <List
                        bordered
                        dataSource={this.state.feedbacks}
                        renderItem={item => (
                        <List.Item
                            actions={[<a onClick={() => this.showModal(item.id)}>回复<Icon type="form" /></a>]}
                        >
                            <em style={{marginRight: 5}}>
                                用户：
                                {item.author}
                            </em>
                            在
                            <em style={{ margin: '0 5px' }}>
                                {moment(item.createAt).format("YYYY-MM-DD HH:mm:ss")}
                            </em>
                            反馈了一条信息：
                            {item.message}
                        </List.Item>)}
                    />
                    <Modal
                        title="回复"
                        visible={this.state.visible}
                        footer={null}
                        onCancel={this.handleCancel}
                    >
                        <Reply 
                            current_feedback_id={this.state.current_feedback_id}
                            handleCancel={this.handleCancel}
                         />
                    </Modal>
                </Card>
            </div>
        );
    }
};
