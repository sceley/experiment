import React, { Component } from 'react';
import { Form, Input, Card, Button, message } from 'antd';
import config from '../config';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
class Notify extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch(`${config.server}/api/admin/notify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.admin_token
                    },
                    body: JSON.stringify(values)
                }).then(res => {
                    if (res.ok)
                        return res.json();
                }).then(json => {
                    if (json && !json.err) {
                        message.info(json.msg);
                        this.props.handleCancel();
                        this.props.addNotification({
                            title: values.Title,
                            msg: values.Notification
                        });
                    } else {
                        message.error(json.msg);
                    }
                });
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="Notify">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        label="标题"
                    >
                        {getFieldDecorator('Title', {
                            rules: [{
                                required: true, message: '请输入你的消息标题!',
                            }],
                        })(
                            <Input placeholder="标题" />
                        )}
                    </FormItem>
                    <FormItem
                        label="消息"
                    >
                        {getFieldDecorator('Notification', {
                            rules: [{
                                required: true, message: '请输入你要发布的消息!',
                            }],
                        })(
                            <TextArea placeholder="消息主体" rows={8} />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit">发布</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
};
export default Form.create()(Notify);