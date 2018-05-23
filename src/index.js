import React from 'react';
import ReactDOM from 'react-dom';
import Flip from './Flip.js'
import Histogram from './Histogram.js'
import Imap from './Imap.js'
import './index.css';

//模拟收入数据
const incomes = ["北京",
                "天津",
                "上海",
                "重庆",
                "河北",
                "山西",
                "辽宁",
                "吉林",
                "黑龙江",
                "江苏",
                "浙江",
                "安徽",
                "福建",
                "江西",
                "山东",
                "河南",
                "湖北",
                "湖南",
                "广东",
                "海南",
                "四川",
                "贵州",
                "云南",
                "陕西",
                "甘肃",
                "青海",
                "台湾",
                "内蒙古",
                "广西",
                "西藏",
                "宁夏",
                "新疆",
                "香港",
                "澳门"].map(function(v){
                  return new Map([
                      ["city",v],
                      ["income",Number((Math.random()*14+6).toFixed(2))]
                    ])
                });
/*格式化柱状图数据
* x:city
* y:income
* [{x,y},{x,y}...]
*/
const data_histogram = incomes.map(function(v){
  return {x:v.get('city'),y:v.get('income')};
});
/*格式化地图数据
* city=>income
*/
const data_map = new Map(incomes.map(v=>[v.get('city'),v.get('income')]));

class Container extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      mapType:this.props.mapType,
      flipRotate:0
    };
  }
  // 切换地图样式
  changeMap(){
    this.setState((prevState,props)=>({
      flipRotate:180,
      mapType:prevState.mapType==='circle'?'heatmap':'circle'
    }));
  }
  render(){
      //const front=<div style={{backgroundColor:"red",textAlign:"center"}}><br/><br/>front<br/><br/><br/></div>;
      //const back=<div style={{backgroundColor:"yellow",textAlign:"center"}}><br/><br/>back<br/><br/><br/></div>;
      const front=<Histogram data={data_histogram}/>;
      const back=<Imap data={data_map} kml='./city.kml' type={this.state.mapType} />;
      return(
        [<div key="flip1" className="container">
          <h1>Horizontal</h1>
          <Flip front={front} back={back} verticalFlip={false} rotate={this.state.flipRotate}></Flip>
        </div>,
        <div key="flip2" className="container">
          <h1>Vertical</h1>
          <Flip front={front} back={back} verticalFlip={true} rotate={this.state.flipRotate}></Flip>
        </div>,
        <div key="changeMap" className='changeMap' onClick={()=>this.changeMap()}>切换</div>]
      )
  }
}

// ========================================

ReactDOM.render(
  <Container mapType='heatmap'/>,
  document.getElementById('root')
);
