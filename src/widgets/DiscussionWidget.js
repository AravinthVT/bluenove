import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types"
import ComponentEvent from "../utils/ComponentEvent"
import "./DiscussionWidget.css"
import BaseComponent from "../components/BaseComponent"
import CompPostDepth from "../components/CompPostDepth"
import CompVoter from "../components/CompVoter"
import lineSep from "../images/lineSep3.svg"
import { changeScreen } from "../actions/screenActions"

import { SCREEN_ID_DISCUSSION} from "../utils/ScreenIDs"


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
		//if(this.props.handleEvent==null) return;
		switch(aEvent.event){
			case ComponentEvent.VOTE_UP:
				console.log("Voting up from DiscussionWidget");
				//this.props.handleEvent(aEvent)
				break;
			case ComponentEvent.VOTE_DOWN:
				console.log("Voting up from DiscussionWidget");
				//this.props.handleEvent(aEvent)
				break;
			case ComponentEvent.CLICK:
				console.log("Selected from DiscussionWidget");
				//this.props.handleEvent(aEvent)
				this.props.changeScreen(SCREEN_ID_DISCUSSION, {loginInfoObj:this.props.loginInfoObj, discussionID:this.props.model._id});
				break;
			default:
				throw Error("unknown event:"+aEvent.event)
		}
	}

	getClassName(id){
		let __result = null;
		switch(id){
			case "title":
				if(this.props.displayType == "expanded"){
					__result =  "discussionWidgetTitle_expanded";
				}else{
					__result =  "discussionWidgetTitle";
				}
				break;
			default:
				throw new Error("getClassName: unkown id type:"+id);
		}
		return __result;
	}

	render() {
		let l_depth =this.props.depth;
		const l_model = this.props.model;
		console.log("this.props.model  l_model");
		console.log(l_model);
		if(l_model==null) return null;
		return (
			//style={{height:this.state.height}}
			<div className="DiscussionWidget" >
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
	            <div className="discussionWidgetInfoContainer" >
	            	<ol>
		            	<li>
		            		<ol className="discussionWidgetInfoGroupContainer">
		            		<li className="discussionWidgetInfoGroupTitle">{l_model.groupName}</li>
		            		<li className="discussionWidgetInfoGroupUser">{l_model.userName}</li>
		            		<li className="discussionWidgetInfoGroupPostTime">{l_model.createdDate}</li>
		            		</ol>
		            	</li>
		            	<li className={this.getClassName("title")} onClick={()=>this.handleEvent({event:ComponentEvent.CLICK})}>
		            	{l_model.title}
		            	</li>
		            	<li className="discussionWidgetContent"  onClick={()=>this.handleEvent({event:ComponentEvent.CLICK})}>
		            	<div>{l_model.description}</div>
		            	</li>
		            	<li>
			            	<div className="discussionWidgetReply">
				        		<ol>
					            	<li>replies: 0</li>
				        			<li>Share</li>
					            	<li>Report</li>
					            	<li>Reply</li>
				        		</ol>
				        	</div>
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

const mapStateToProps = (state) =>{
	console.log("LoginWidget: mapStateToProps: check the state here");
	console.log(state)
	return {
		currentScreenID: state.screenContext.screenID,
		nextScreenID:state.screenContext.nextScreenID,
		loginInfoObj:state.loginContext.loginInfoObj,
		loginStatus:state.loginContext.loginStatus
	}
}

export default connect(mapStateToProps,{ changeScreen})(DiscussionWidget)