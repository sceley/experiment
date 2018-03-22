import React, { Component } from 'react';
import { Table } from 'antd';
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
    render () {
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
                        return '开启中'
                    } else {
                        return '关闭中'
                    }
                }
            }, {
                title: '操作',
                dataIndex: 'id',
                key: '4',
                render: id => {
                    return id;
                }
            }
        ];
        return (
            <div className="ColMonitor">
                <Table rowKey="id" bordered={true} columns={columns} dataSource={this.state.tables}/>
            </div>
        );
    }
};