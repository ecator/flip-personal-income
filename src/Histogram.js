import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import "./Histogram.css";
class Histogram extends React.Component{
	constructor(props){
		super(props);
		this.state={
			data:props.data
		};
	}
	componentDidMount(){
		const svgW = this.chartRef.parentElement.offsetWidth;
		const svgH = this.chartRef.parentElement.offsetHeight;
		//this.chartRef.parentElement.style.height=svgH*1.1+"px";
		//console.log(svgW);
		const data = this.props.data;
		if (!(data instanceof Array) || data.length === 0) {
			return;
		}
		const svg = d3.select(this.chartRef);
		//颜色比例尺，相邻数据可以用同一颜色表示
		let colors = d3.scaleQuantize().domain([d3.min(data,d=>d.y),d3.max(data,d=>d.y)]).range(d3.schemePaired);
		//坐标轴生成器
		const axisX = d3.axisBottom(d3.scaleBand().domain(data.map(d=>d.x)).rangeRound([0,svgW*0.8]).padding(0.1));
		const axisY = d3.axisLeft(d3.scaleLinear().domain([0,d3.max(data,d=>d.y)]).rangeRound([svgH*0.8,0]));
		//添加坐标轴
		svg.append("g")
			.attr("transform",`translate(${parseInt(svgW*0.1)},${parseInt(svgH*0.9)})`)
			.attr("class","axisx")
			.call(axisX);
		svg.append("g")
			.attr("transform",`translate(${parseInt(svgW*0.1)},${parseInt(svgH*0.1)})`)
			.attr("class","axisy")
			.call(axisY);
		//添加Y轴说明
		svg.append("text")
			.attr("class","tag-y")
			.attr("transform",`translate(${parseInt(svgW*0.1)},${parseInt(svgH*0.1)})`)
			.attr("text-anchor","middle")
			.attr("x","0")
			.attr("y","-0.6em")
			.text("万元/年");
		//画柱状图
		svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("transform",`translate(${parseInt(svgW*0.1)},${parseInt(0)})`)
			.attr("x",d=>axisX.scale()(d.x))
			.attr("y",parseInt(svgH*0.9))
			.attr("width",axisX.scale().bandwidth())
			.transition()
			.duration(100)
			.delay((d,i)=>i * 20)
			.attr("y",d=>parseInt(svgH*0.1)+axisY.scale()(d.y))
			.attr("height",d=>parseInt(svgH*0.8)-axisY.scale()(d.y))
			.attr("fill",d=>colors(d.y));
		//在柱状图上面添加数据标签
		svg.append("g")
			.selectAll("text")
			.data(data)
			.enter()
			.append("text")
			.attr("class","tag")
			.attr("transform",`translate(${parseInt(svgW*0.1)},${parseInt(0)})`)
			.attr("text-anchor","middle")
			.attr("x",d=>axisX.scale()(d.x))
			.attr("y",d=>parseInt(svgH*0.1)+axisY.scale()(d.y))
			.attr("dx",axisX.scale().bandwidth()/2)
			.text(d=>d.y);
	}
	render(){
		return (
			<div className="histogram-container">
				<svg width="100%" height="100%" ref={(r)=>this.chartRef=r}></svg>
			</div>
		);
	}
}
Histogram.propTypes = {
	data:PropTypes.array
};
export default Histogram;