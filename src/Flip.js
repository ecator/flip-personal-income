import React from 'react';
import PropTypes from 'prop-types';
import "./Flip.css";
class Flip extends React.Component{
	constructor(props){
		super(props);
		this.state={
			rotate:this.props.rotate
		};
	}
	handleClick(){
		this.setState({rotate:this.state.rotate+180})
	}
	static getDerivedStateFromProps(nextProps, prevState){
		//console.log(nextProps,prevState);
		if (nextProps.rotate === prevState.rotate) {
			return null;
		}else{
			return {rotate:nextProps.rotate};
		}
	}
	render(){
		let flipStyle;
		if (this.props.verticalFlip) {
			flipStyle={transform:`rotateX(${this.state.rotate}deg)`};
		}else{
			flipStyle={transform:`rotateY(${this.state.rotate}deg)`};
		}
		return (
			<div className="flip-container">
				<div className="flipper" style={flipStyle} onClick={()=>this.handleClick()}>
					<div className="fliper-front">
						{/*front content*/}
						{this.props.front}
					</div>
					<div className={`fliper-back fliper-back-${this.props.verticalFlip?"vertical":"horizontal"}`}>
						{/*back content*/}
						{this.props.back}
					</div>
				</div>
			</div>
		);
	}
}
Flip.defaultProps = {
	verticalFlip:false,
	rotate:0
};
Flip.propTypes = {
	front:PropTypes.node,
	back:PropTypes.node,
	verticalFlip:PropTypes.bool,
	rotate:PropTypes.number
};
export default Flip;