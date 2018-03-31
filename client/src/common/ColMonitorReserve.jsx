import React, { Component } from 'react';
import { Table, Icon, Switch, Card, Popconfirm, message } from 'antd';
import moment from 'moment';
import config from '../config';

export default class ColMonitorReserve extends Component {
    state = {
        reserves: []
    }
    componentWillMount = () => {
        let status = this.props.status;
        fetch(`${config.server}/api/admin/reserves?status=${status}`, {
            method: 'get',
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
                    reserves: json.reserves
                });
            }
        });
    }
    permission = (id, status) => {
        let body = {
            id,
            status
        };
        fetch(`${config.server}/api/admin/switchreserve`, {
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
                let reserves = this.state.reserves;
                reserves = reserves.map(item => {
                    if (item.id === id) {
                        item.status = !item.status;
                    }
                    return item;
                });
                this.setState({
                    reserves: reserves
                });
            } else {
                message.error(json.msg);
            }
        });

    }
    render () {
        const columns = [{
            title: '序列',
            dataIndex: 'id',
            key: '1',
            render: text => text,
        }, {
            title: '时间',
            dataIndex: 'createAt',
            key: '2',
            render: text => moment(text).format("YYYY-MM-DD")
        }, {
            title: '实验室',
            dataIndex: 'name',
            key: '3',
            render: text => text
        }, {
            title: '座位',
            dataIndex: 'seat',
            key: '4',
            render: text => `${text}`
        }, {
            title: '地点',
            dataIndex: 'address',
            key: '5'
        }, {
            title: '其他设备',
            dataIndex: 'equipment',
            key: '6',
            render: text => text || '无'
        }, {
            title: '审核人',
            dataIndex: 'approver',
            key: '7',
            render: text => text || '无'
        }, {
            title: '状态',
            dataIndex: 'status',
            key: '8',
            render: text => {
                if (text === 0) {
                    return '审核中'
                } else if (text === 1) {
                    return '审核通过'
                } else if (text === 2) {
                    return '执行中'
                } else {
                    return '已执行'
                }
            }
        }, {
            title: '开始时间',
            dataIndex: 'start',
            key: '9',
            render: text => {
                return text;
            }
        }, {
            title: '结束时间',
            dataIndex: 'end',
            key: '10',
            render: text => {
                return `${text}`;
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: '11',
            render: (id, record) => {
                let status = record.status;
                let handleChange = () => {
                    this.permission(id, !status);
                };
                if (status) {
                    return (
                        <Popconfirm title="确定不允许?" onConfirm={handleChange} okText="Yes" cancelText="No">
                            <a>不允许</a>
                        </Popconfirm>
                    );
                } else {
                    return (
                        <Popconfirm title="确定允许?" onConfirm={handleChange} okText="Yes" cancelText="No">
                            <a>允许</a>
                        </Popconfirm>
                    );
                }
            }
        }];
        if (this.props.status == 3 || this.props.status == 1) {
            columns.pop();
        }
        return (
            <div className="ColMonitorReserve">
                <Table pagination={false} rowKey="id" bordered={true} columns={columns} dataSource={this.state.reserves} />
            </div>
        );
    }
}