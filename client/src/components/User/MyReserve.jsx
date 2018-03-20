import React, { Component } from 'react';
import moment from 'moment';
import { Table, Divider, Icon } from 'antd';
import config from '../../config';
export default class MyReserve extends Component {
    state = {
        reserves: ''
    }
    componentWillMount = () => {
        fetch(`${config.server}/api/onereserves`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.user_token
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
            title: '序列',
            dataIndex: 'id',
            key: 'id',
            render: text => text,
        }, {
            title: '时间',
            dataIndex: 'createAt',
            key: 'createAt',
            render: text => moment(text).format("YYYY-DD-MM HH:MM:SS")
        }, {
            title: '实验室',
            dataIndex: 'exp_id',
            key: 'exp_id',
            render: text => `实验室${text}`
        }, {
            title: '座位',
            dataIndex: 'table_id',
            key: 'table_id',
            render: text => `${text}`
        }, {
            title: '地点',
            dataIndex: 'address',
            key: 'address'
        }, {
            title: '其他设备',
            dataIndex: 'equipment',
            key: 'equipment',
            render: text => text || '无'
        }, {
            title: '状态',
            dataIndex: 'pass',
            key: 'pass',
            render: text => {
                if (text === 0)
                    return '审核中'
                else 
                    return '通过'
            }
        }, {
            title: '操作',
            key: 'action',
            render: () => {
                return (
                    <a>
                        <Icon type="delete"/>
                    </a>
                );
            }
        }];
        return (
            <div className="MyReserve">
                <Table size="small" bordered={true} columns={columns} pagination={false} dataSource={this.state.reserves}/>
            </div>
        );
    }
}