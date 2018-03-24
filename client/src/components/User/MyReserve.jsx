import React, { Component } from 'react';
import moment from 'moment';
import { Tabs, Card } from 'antd';
import config from '../../config';
import ColReserve from '../../common/ColReserve';
const TabPane = Tabs.TabPane;
export default class MyReserve extends Component {
    state = {
        reserves: []
    }
    render () {
        return (
            <div className="MyReserve Container">
                <Card>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="未执行" key="1">
                            <ColReserve complete={0}/>
                        </TabPane>
                        <TabPane tab="已执行" key="2">
                            <ColReserve complete={1} />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }
}