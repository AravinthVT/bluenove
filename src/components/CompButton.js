import React from 'react';
import BaseComponent from "./BaseComponent"
import ComponentEvent from "../utils/ComponentEvent"
import "./CompButton.css"

export class CompButton extends BaseComponent {
	constructor(props){
		super(props);
		props={value:"", enabled:true}
		this.state={enabled:true}
	}
	render() {
		let compClass = "CompButton"
		let l_enabled =true
		let clickHandler = ()=>this.handleEvent({event:ComponentEvent.CLICK});
		if(this.props.enabled===false){
			 compClass = "CompButtonDisabled"
			 l_enabled = false;
			 clickHandler=null;
		}
		return (
			<div className={compClass} onClick={clickHandler}>{this.props.value}</div>
		);
	}
}

export default CompButton
