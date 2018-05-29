import React, { Component } from 'react';
import moment from 'moment';
import { Table, message } from 'antd';
import config from '../config';

export default class Reservation extends Component {
    state = {
        reserves: []
    }
    cancelReserve = (id) => {
        fetch(`${config.server}/api/user/reserve/${id}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': localStorage.user_token
            }
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(json => {
            if (json && !json.err) {
                let reserves = this.state.reserves;
                reserves = reserves.filter(reserve => {
                    return Number(reserve.id) !== Number(id);
                });
                this.setState({
                    reserves: reserves
                });
                message.info(json.msg);
            } else if (json && json.err) {
                message.error(json.msg);
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
                let reserves = this.state.reserves;
                reserves = reserves.filter(reserve => {
                    return Number(reserve.id) !== Number(id);
                });
                this.setState({
                    reserves: reserves
                });
            } else if (json && json.err) {
                message.error(json.msg);
            }
        });
    }
    componentDidMount = () => {
        const role = this.props._role;
        const status = this.props.status;
        fetch(`${config.server}/api/${role}/reserves?status=${status}`, {
            method: 'get',
            headers: {
                'x-access-token': localStorage[`${role}_token`]
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
    render() {
        const columns = [{
            title: '用户名',
            dataIndex: 'user_name',
            key: '1',
            render: user_name => user_name,
        }, {
            title: '预约日期',
            dataIndex: 'date',
            key: '2',
            render: date => moment(date).format("YYYY-MM-DD")
        }, {
            title: '预约时间段',
            key: '3',
            render: record => {
                return `${record.start}-${record.end}`;
            }
        }, {
            title: '预约实验室',
            dataIndex: 'exp_name',
            key: '4',
                render: exp_name => exp_name
        }, {
            title: '预约实验台',
            dataIndex: 'seat',
            key: '5',
            render: seat => `实验台${seat}`
        }, {
            title: '实验室地点',
            dataIndex: 'address',
            key: '6',
            render: address => address
        }, {
            title: '其他设备',
            dataIndex: 'equipment',
            key: '7',
            render: equipment => equipment || '无'
        }, {
            title: '审核人',
            dataIndex: 'approver',
            key: '8',
            render: approver => approver || '无'
        }, {
            title: '进入时间',
            dataIndex: 'go_into_time',
            key: '9',
            render: go_into_time => {
                if (go_into_time) {
                    return moment(go_into_time).format('HH:mm:ss');
                } else {
                    return '暂无';
                }  
            }
        }, {
            title: '离开时间',
            dataIndex: 'leave_time',
            key: '10',
            render: leave_time => {
                if (leave_time) {
                    return moment(leave_time).format('HH:mm:ss');
                } else {
                    return '暂无';
                } 
            }
        }];
        if (this.props.action) {
            this.props.action.cancelReserve = this.cancelReserve;
            this.props.action.permission = this.permission;
            columns.push(this.props.action);
        }
        return (
            <div className="Reservation">
                <Table pagination={false} rowKey="id" bordered={true} columns={columns} dataSource={this.state.reserves} />
            </div>
        );
    }
}