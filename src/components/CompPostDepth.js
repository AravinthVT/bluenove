import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./CompPostDepth.css"

export class CompPostDepth extends Component {
	constructor(props){
		super(props)
		props={level:0}
		this.state={level:0}
		this.generateSeparators = this.generateSeparators.bind(this);
	}

	/*componentDidMount(){
		console.log(this)
		this.setSate({level:5});
	}*/

	generateSeparators(){
		var lineSeparators = []
		//console.log("CompPostDepth:: generateSeparators:: this.props.level::"+this.props.level)
		//console.log("CompPostDepth:: generateSeparators:: this.props.level::"+typeof(this.props.level))
		let len = parseInt(this.props.level, 10);
		for(var i = 0; i<len; i++) {
			console.log("i="+i)
			lineSeparators.push(<li>:</li>);
		}
		return lineSeparators;
	}

	render() {
		//console.log("CompPostDepth:: "+this.props.level)
		//console.log(this.state.level)
		//console.log(this.generateSeparators())
		const items = this.generateSeparators()
		return (
			<ol className="CompPostDepth">
				{items}
			</ol>
		);
	}
}


CompPostDepth.propTypes={
	level:PropTypes.number
};


export default CompPostDepth