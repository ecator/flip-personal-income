import React from 'react';
import PropTypes from 'prop-types';
import _Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import Heatmap from 'ol/layer/heatmap';
import VectorLayer from 'ol/layer/vector';
import Stamen from 'ol/source/stamen';
import Vector from 'ol/source/vector';
import Style from 'ol/style/style';
import Circle from 'ol/style/circle';
import Text from 'ol/style/text';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import KML from 'ol/format/kml';
import control from 'ol/control';
import 'ol/ol.css';
import "./Imap.css";

class Imap extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			data:props.data,
			kml:props.kml,
            type:props.type
		};
		this.ref = React.createRef();
        this.map = null;
	}
    componentDidUpdate(prevProps,prevState){
        //console.log(prevProps,prevState);
        this.componentDidMount();
    }
	componentDidMount(){
		const data = this.props.data;
        const kml = this.props.kml;
        const type = this.props.type;
		const colors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"];
        const weight_min = 0.1;
        const weight_max = 1;
        const radius_min = 10;
        const radius_max = 20;
        //以data为定义域获取指定值域的值，关系为线性关系
        let getRange=(v,range_min,range_max)=>{
            let min = Math.min(...data.values());
            let max = Math.max(...data.values());
            let k = (range_max - range_min)/(max-min);
            let d = range_max - k * max;
            return k * data.get(v) + d;
        };
    	//地图层
		const raster = new TileLayer({
    	  source:new Stamen({
    	    layer:'toner'
    	  })
    	});
    	//矢量层
        let vector;
        switch(type){
            //热图
            case 'heatmap':
                vector = new Heatmap({
                  source:new Vector({
                            url:kml,
                            format:new KML({extractStyles:false})
                          }),
                  radius: 20,
                  blur: 30,
                  gradient:colors
                });
                //动态设置热图的大小
                vector.getSource().on('addfeature', function(event) {
                  let name = event.feature.get('name');
                  let weight = getRange(name,weight_min,weight_max);
                  //console.log(name,weight);
                  event.feature.set('weight', weight);
                });
                break;
            //标注圆
            case 'circle':
                let getColorByRadius=(radius)=>{
                    let step = (radius_max - radius_min) / colors.length;
                    for (let i = 0 ;i < colors.length;i++){
                        if ((radius >= radius_min+i*step && radius < radius_min+(i+1)*step) || radius>=radius_max) {
                            return colors[i];
                        }
                    }
                };
                let styleFunction = (feature)=>{
                    let name = feature.get('name');
                    let radius = getRange(name,radius_min,radius_max);
                    //console.log(name,data.get(name),radius,getColorByRadius(radius));
                    let style = new Style({
                      image: new Circle({
                        radius: radius,
                        fill: new Fill({
                          color: getColorByRadius(radius)
                        }),
                        stroke: new Stroke({
                          color: getColorByRadius(radius),
                          width: 1
                        })
                      }),
                      text:new Text({
                        text:data.get(name).toString(),
                        scale:0.8
                      })
                    });
                    return style;
                };
                vector = new VectorLayer({
                  source:new Vector({
                    url:kml,
                    format:new KML({extractStyles:false})
                  }),
                  style:styleFunction
                });
                break;
            default:
                console.error('unknown type:' + type);
                return;

        }
    	
    	//构造地图
        if (this.map) {
            this.map.unset('layers');
            this.map.addLayer(raster);
            this.map.addLayer(vector);
        }else{
            this.map = new _Map({
                target:this.ref.current,
                layers:[raster,vector],
                view:new View({
                  center:[11751653,4300000],
                  zoom:3.8
                }),
                controls:control.defaults({
                  zoom:false,
                  attribution:false
                })
            })
        }
	}
	render(){
		return (
			<div className="map-container">
				<div className="map" ref={this.ref}></div>
			</div>
		);
	}
}
Imap.propTypes = {
	data:PropTypes.instanceOf(Map).isRequired,
	kml:PropTypes.string.isRequired,
    type:PropTypes.string.isRequired
};
export default Imap;