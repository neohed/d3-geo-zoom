import React from 'react'
import {geoAlbers, geoPath} from "d3-geo"
import {zoom} from 'd3-zoom'
import {event, select} from 'd3-selection'
import {scaleLinear} from "d3-scale";
import {max} from "d3-array";

const svgStyle = {
    backgroundColor: '#F9F9F9'
};
const style = {
    fill: 'none',
    stroke: 'black',
    strokeWidth: '1px'
};
const width = 860,
    height = 1160;

const loc = [-1.8904, 52.4862];

function projectionBounds(projection, maxlat) {
    let yaw = projection.rotate()[0],
        xymax = projection([-yaw+180-1e-6,-maxlat]),
        xymin = projection([-yaw-180+1e-6, maxlat]);

    return [xymin,xymax];
}

class MyScatterPlot extends React.Component {
    projection;
    path;
    tlast;
    slast;
    constructor(props) {
        super(props);

        this.state = {
            zoomTransform: null
        };
        this.tlast = [0,0];
        this.slast = null;

        this.updateD3(props);

        this.zoom = zoom()
            .scaleExtent([-5, 5])
            .translateExtent([[-100, -100], [props.width + 100, props.height + 100]])
            .extent([[-100, -100], [props.width + 100, props.height + 100]])
            .on("zoom", this.zoomed.bind(this))
    }

    componentDidMount() {
        select(this.svg)
            .call(this.zoom)
    }

    componentDidUpdate() {
        select(this.svg)
            .call(this.zoom)
    }
    componentWillUpdate(nextProps) {
        this.updateD3(nextProps);
    }

    zoomed() {
        this.setState({
            zoomTransform: event.transform,
        });
    }

    updateD3(props) {
        const { data, width, height, zoomTransform, zoomType } = props;

        // debugger;

        const d = [...data[0].geometry.coordinates, ...data[1].geometry.coordinates , ...data[2].geometry.coordinates];

        this.xScale = scaleLinear()
            .domain([0, max(d, ([x, y]) => x)])
            .range([0, width]);

        this.yScale = scaleLinear()
            .domain([0, max(d, ([x, y]) => y)])
            .range([0, height]);

        if (zoomTransform && zoomType === "detail") {
            this.xScale.domain(zoomTransform.rescaleX(this.xScale).domain());
            this.yScale.domain(zoomTransform.rescaleY(this.yScale).domain());
        }

        this.projection = geoAlbers()
            .center([0, 55.4])
            .rotate([4.4, 0])
            .parallels([50, 60])
            .scale(width * 5.6)
            .translate([width / 2, height / 2]);

        this.pathGenerator = geoPath().projection(this.projection);
    }

    get transform() {
        const { x, y } = this.props;
        return `translate(${x}, ${y})`;
    }

    render() {
        const { data } = this.props;
        const {zoomTransform} = this.state;

        const xy = this.projection(loc);
        const [x, y] = xy;
        const circle = <circle cx={(x)} cy={(y)} r="8" stroke="black" strokeWidth="3" fill="red" />;
//console.log(this.zoom);
        return (
            <svg width={width} height={height} style={svgStyle} ref={svg => this.svg = svg}>
                <g>
                    {data.map((d, i) => <path key={i} d={this.pathGenerator(d)} style={style} strokeWidth={1} />)}
                    {circle}
                </g>
            </svg>
            /*
             transform={zoomTransform}
             */
        )
    }
}

export default MyScatterPlot;
