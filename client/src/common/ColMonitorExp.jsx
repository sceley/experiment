import React, { Component } from 'react';
import { Table, Switch, message } from 'antd';
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
                console.log(json);
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
                    let power = Boolean(this.state.tables[id - 1] && this.state.tables[id - 1].power_status);
                    let handleChange = (e) => {
                        this.handleSwitch(id, e);
                    };
                    return (
                        <Switch onChange={handleChange} checkedChildren="开" unCheckedChildren="关" defaultChecked={power} />
                    );
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