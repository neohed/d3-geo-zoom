import React from 'react'
import MyScatterPlot from './MyScatterPlot'
import {data} from '../data/geo_q7s3.topo'
import {feature} from 'topojson-client';
import '../css/chart.css'

const features = feature(data, data.objects.geo);

class MyChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: features.features,
        };
    }

    render() {
        const { width, height } = this.props;

        return (
            <MyScatterPlot data={this.state.data}
                           x={width / 2} y={0}
                           width={width / 2}
                           height={height}
            />
        )
    }
}

export default MyChart;
