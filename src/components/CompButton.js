import React from 'react';
import BaseComponent from "./BaseComponent"
import ComponentEvent from "../utils/ComponentEvent"
import "./CompButton.css"

export class CompButton extends BaseComponent {
	constructor(props){
		super(props);
		props={value:""}
		this.state={}
	}
	render() {
		return (
			<div className="CompButton" onClick={()=>this.handleEvent({event:ComponentEvent.CLICK})}>{this.props.value}</div>
		);
	}
}

export default CompButton
