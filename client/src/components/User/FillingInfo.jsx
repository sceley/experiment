import React, { Component } from 'react';
import { Input, Icon, message, Button, Form, Radio, Select } from 'antd';
import logo from '../../logo.png';
import config from '../../config';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

class FillingInfo extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch(`${config.server}/api/user/fillinginfo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.user_token
                    },
                    body: JSON.stringify(values)
                }).then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                }).then(json => {
                    if (json && !json.err) {
                        this.props.history.push('/user');
                    } else if (json && json.err) {
                        message.error(json.msg);
                    }
                });
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{ height: '100vh' }} className="Log-Container">
                <div className="FillingInfo">
                    <div className="log-logo-wrap">
                        <img className="log-logo" style={{ height: 64 }} src={logo} alt="logo" />
                    </div>
                    <div className="Title">
                        完善信息
					</div>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            label="姓名"
                        >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '姓名不能为空!' }]
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="姓名" />
                            )}
                        </FormItem>
                        <FormItem
                            label="性别"
                        >
                            {getFieldDecorator('gender', {
                                rules: [{ required: true }],
                            })(
                                <RadioGroup>
                                    <Radio value="1">男</Radio>
                                    <Radio value="0">女</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem
                            label="专业"
                        >
                            {getFieldDecorator('major', {
                                rules: [{ required: true, message: '专业不能为空!' }]
                            })(
                                <Input prefix={<Icon type="flag" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="专业" />
                            )}
                        </FormItem>
                        <FormItem
                            label="年级"
                        >
                            {getFieldDecorator('grade', {
                                rules: [{ required: true }]
                            })(
                                <Select>
                                    <Option value="1">大一</Option>
                                    <Option value="2">大二</Option>
                                    <Option value="3">大三</Option>
                                    <Option value="4">大四</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button style={{width: '100%'}} type="primary" htmlType="submit">
                                完善
							</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
};
export default Form.create()(FillingInfo);