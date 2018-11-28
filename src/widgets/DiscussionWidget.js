import React, { Component } from 'react';
import PropTypes from "prop-types"
import ComponentEvent from "../utils/ComponentEvent"
import "./DiscussionWidget.css"
import BaseComponent from "../components/BaseComponent"
import CompPostDepth from "../components/CompPostDepth"
import CompVoter from "../components/CompVoter"
import lineSep from "../images/lineSep3.svg"


export class DiscussionWidget extends BaseComponent {
	constructor(props){
		super(props);
		props={model:{
			id:-1,
			groupName:"defaultGroupName",
			userName:"guest",
			createdDate:"new Date()",
			content:"default content"
		}, depth:2};
		this.state={height:"200px"}
		this.handleEvent = this.handleEvent.bind(this);
	}

	getModel(){
		const defaultModel = {
			id:-1,
			groupName:"defaultGroupName",
			userName:"guest",
			createdDate:new Date(),
			content:"default content"
		}
		return (this.props.model || defaultModel)
	}

	handleEvent(aEvent){
		if(this.props.handleEvent==null) return;
		switch(aEvent.event){
			case ComponentEvent.VOTE_UP:
				console.log("Voting up from DiscussionWidget");
				this.props.handleEvent(aEvent)
				break;
			case ComponentEvent.VOTE_DOWN:
				console.log("Voting up from DiscussionWidget");
				this.props.handleEvent(aEvent)
				break;
			case ComponentEvent.CLICK:
				console.log("Selected from DiscussionWidget");
				this.props.handleEvent(aEvent)
				break;
			default:
				throw Error("unknown event:"+aEvent.event)
		}
	}

	render() {
		let l_depth =this.props.depth;
		const l_model = this.props.model;
		if(l_model==null) return null;
		return (
			<div className="DiscussionWidget" style={{height:this.state.height}}>
				<div className="discussionWidgetVoteContainer">
					<div className="discussionWidgetCountContainer">
		             	<CompPostDepth level={l_depth}/>
	              	</div>
					<div className="discussionWidgetCountContainer">
		             	<CompVoter handleEvent={this.handleEvent}/>
		             	<div style={{backgroundImage:lineSep}}>
	              		</div>
	              	</div>
	            </div>
	            <div className="discussionWidgetInfoContainer" onClick={()=>this.handleEvent({event:ComponentEvent.CLICK})}>
	            	<ol>
		            	<li>
		            		<ol className="discussionWidgetInfoGroupContainer">
		            		<li className="discussionWidgetInfoGroupTitle">{l_model.groupName}</li>
		            		<li className="discussionWidgetInfoGroupUser">{l_model.userName}</li>
		            		<li className="discussionWidgetInfoGroupPostTime">{l_model.createdDate}</li>
		            		</ol>
		            	</li>
		            	<li className="discussionWidgetTitle">
		            	{l_model.title}
		            	</li>
		            	<li className="discussionWidgetContent">
		            	{l_model.description}
		            	</li>
	            	</ol>
	        	</div>
			</div>		
		);
	}
}

DiscussionWidget.propTypes = {
	level:PropTypes.number
}

export default DiscussionWidget