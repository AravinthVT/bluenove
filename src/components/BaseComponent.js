import React, { Component } from 'react';

export class BaseComponent extends Component {
	constructor(props){
		super(props);
		this.handleEvent=this.handleEvent.bind(this);
	}
	handleEvent(aEvent){
		if(this.props.handleEvent)
			this.props.handleEvent(aEvent);
	}
	render() {
		return (
			<div></div>
		);
	}
}

export default BaseComponent