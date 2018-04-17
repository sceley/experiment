import React, { Component } from 'react';
import { Card } from 'antd';
import echarts from 'echarts';
import config from '../../config';
import moment from 'moment';
export default class ExpDataStatistics extends Component {
    state = {
        exp_statistics: [],
        time_statistics: '',
        weekdatas: []
    }
    componentDidMount = async () => {
        const res = await fetch(`${config.server}/api/admin/expdatastatics`);
        const json = await res.json();
        this.setState({
            exp_statistics: json.exp_statistics,
            time_statistics: json.time_statistics,
            weekdatas: json.weekdatas
        });
        const exp_statistics = this.state.exp_statistics.map(exp_statistic => {
            exp_statistic.value = exp_statistic.count;
            delete exp_statistic.count;
            return exp_statistic;
        });
        echarts.init(this.refs.exp_statistics).setOption({
            title: {
                text: '实验室偏向统计'
            },
            series: {
                type: 'pie',
                data: exp_statistics
            }
        });
        const time_statistics = [];
        for(const key in this.state.time_statistics) {
            const item = {};
            item.name = this.state.time_statistics[key].time;
            item.value = this.state.time_statistics[key].count;
            time_statistics.push(item);
        }
        echarts.init(this.refs.time_statistics).setOption({
            title: {
                text: '一日各时间段预约统计'
            },
            series: {
                type: 'pie',
                data: time_statistics
            }
        });
        const x_datas = this.state.weekdatas.map(weekdata => {
            const day = moment(weekdata.date).days();
            switch (day) {
                case 0:
                    return `星期天`;
                case 1:
                    return `星期一`;
                case 2:
                    return `星期二`;
                case 3: 
                    return `星期三`;
                case 4: 
                    return `星期四`;
                case 5: 
                    return `星期五`;
                case 6:
                    return `星期六`;
                default :
                    return '空';
            }
        });
        const value_datas = this.state.weekdatas.map(weekdata => {
            return Math.ceil(weekdata.hours);
        });
        echarts.init(this.refs.week_datas).setOption({
            title: {
                text: '近一周日约小时量'
            },
            tooltip: {},
            legend: {
                data: ['hours']
            },
            xAxis: {
                data: x_datas
            },
            yAxis: {},
            series: [{
                name: 'hours',
                type: 'bar',
                data: value_datas
            }]
        });
    }
    render () {
        return (
            <div className="ExpDataStatistics Container">
                <Card
                    title="实验室数据统计"
                >
                    <div className="graph">
                        <div className="graph-item">
                            <div style={{ width: '400px', height: '400px' }} ref="exp_statistics"></div>
                        </div>
                        <div className="graph-item">
                            <div style={{ width: '400px', height: '400px' }} ref="time_statistics"></div>
                        </div>
                        <div style={{marginTop: 20}} className="graph-item">
                            <div style={{ width: '400px', height: '400px' }} ref="week_datas"></div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}