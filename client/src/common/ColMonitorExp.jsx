import React, { Component } from 'react';
import { Table, Switch, message, Popconfirm, Icon } from 'antd';
import config from '../config';
export default class ColMonitorExp extends Component {
    state = {
        tables: []
    }
    componentDidMount = () => {
        let id = this.props.id;
        fetch(`${config.server}/api/admin/monitorexp/${id}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.admin_token
            }
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(json => {
            if (json && !json.err) {
                this.setState({
                    tables: json.tables
                });
            }
        });
    }
    handleSwitch = (id, e) => {
        let body = {
            id,
            power: e
        };
        fetch(`${config.server}/api/admin/switchpower`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.admin_token
            },
            body: JSON.stringify(body)
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                message.info(json.msg);
            } else {
                message.error(json.msg);
            }
        });
    }
    render() {
        const columns = [
            {
                title: '座位',
                dataIndex: 'id',
                key: '1',
                render: text => text
            }, {
                title: '状态',
                dataIndex: 'status',
                key: '2',
                render: text => {
                    if (text) {
                        return '已被预约'
                    } else {
                        return '可预约'
                    }
                }
            }, {
                title: '电源状态',
                dataIndex: 'power_status',
                key: '3',
                render: text => {
                    if (text) {
                        return (
                            <span>
                                <Icon style={{ color: 'green', marginRight: '8px' }} type="bulb" />
                                开启中
                            </span>

                        )
                    } else {
                        return (
                            <span>
                                <Icon style={{ color: 'red', marginRight: '8px' }} type="bulb" />
                                关闭中
                            </span>

                        )
                    }
                }
            }, {
                title: '电源操作',
                dataIndex: 'id',
                key: '4',
                render: id => {
                    let power = this.state.tables[id - 1] && this.state.tables[id - 1].power_status;
                    let handleChange = () => {
                        this.handleSwitch(id, !power);
                    };
                    if (power) {
                        return (
                            <Popconfirm title="确定关闭?" okText="Yes" cancelText="No" onConfirm={handleChange}>
                                <a>关闭</a>
                            </Popconfirm>
                        );
                    } else {
                        return (
                            <Popconfirm title="确定打开?" okText="Yes" cancelText="No" onConfirm={handleChange}>
                                <a>打开</a>
                            </Popconfirm>
                        );
                    }
                }
            }
        ];
        return (
            <div className="ColMonitor">
                <Table pagination={false} rowKey="id" bordered={true} columns={columns} dataSource={this.state.tables} />
            </div>
        );
    }
};