import React, { Component } from 'react';
import { Tabs, Card, Popconfirm } from 'antd';
import Reserve from '../../common/Reservation';
const TabPane = Tabs.TabPane;
export default class MyReserve extends Component {
    action = {
        title: '操作',
        dataIndex: 'id',
        key: '11',
        render: (id, record) => {
            const handleConfirm = () => {
                this.action.cancelReserve(id);
            };
            return (
                <Popconfirm title="确定取消?" okText="Yes" cancelText="No" onConfirm={handleConfirm}>
                    <a>
                        取消
  					</a>
                </Popconfirm>
            );
        }
    };
    render () {
        return (
            <div className="MyReserve Container">
                <Card>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="待审核预约" key="1">
                            <Reserve action={this.action} _role="user" status={0}/>
                        </TabPane>
                        <TabPane tab="已审核预约" key="2">
                            <Reserve action={this.action} _role="user" status={1} />
                        </TabPane>
                        <TabPane tab="执行中预约" key="3">
                            <Reserve _role="user" status={2} />
                        </TabPane>
                        <TabPane tab="已执行预约" key="4">
                            <Reserve _role="user" status={3} />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }
};