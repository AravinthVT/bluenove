import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types"
import ComponentEvent from "../utils/ComponentEvent"
import "./DiscussionWidget.css"
import BaseComponent from "../components/BaseComponent"
import CompPostDepth from "../components/CompPostDepth"
import CompVoter from "../components/CompVoter"
import CompButton from "../components/CompButton"
import lineSep from "../images/lineSep3.svg"
import { changeScreen, panelNewPostEntry } from "../actions/screenActions"
import { deleteDiscussion } from "../actions/postActions"
import { SCREEN_ID_DISCUSSION, SCREEN_ID_HOME} from "../utils/ScreenIDs"
import { QUERY_LIFECYCLE_IDLE, QUERY_LIFECYCLE_SENT, QUERY_LIFECYCLE_SUCCESS, QUERY_LIFECYCLE_FAILED } from "../utils/QueryLifeCycle"


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
		this.getDeleteBtnVisibility = this.getDeleteBtnVisibility.bind(this);
		this.getReplyBtnVisibility  = this.getReplyBtnVisibility.bind(this);

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
				this.props.changeScreen(SCREEN_ID_DISCUSSION, {loginInfoObj:this.props.loginInfoObj, discussionID:this.props.model._id, currentDocType:"discussion"});
				break;
			case "reply":
				this.props.changeScreen(SCREEN_ID_DISCUSSION, {loginInfoObj:this.props.loginInfoObj, discussionID:this.props.model._id, currentDocType:"discussion"});
				this.props.panelNewPostEntry({visible:true});
				break;
			case "delete":
				this.props.deleteDiscussion(this.props.model._id);
				break;
			default:
				throw Error("unknown event:"+aEvent.event)
		}
	}

	shouldComponentUpdate(nextProp, nextState){
		if(this.props.deleteDiscussionStatus == QUERY_LIFECYCLE_SUCCESS){
			this.props.changeScreen(SCREEN_ID_HOME, {loginInfoObj:this.props.loginInfoObj, discussionID:this.props.model._id, currentDocType:"discussion"});
		}
		if(this.props.deleteDiscussionStatus == QUERY_LIFECYCLE_FAILED){
			alert("Failed to delete the discussion");
		}
		return true
	}


	//--------------------------------- helper methods ------------------------------------------------
	getReplyBtnVisibility(){
		if(this.props.displayType !== "expanded"){
				return "visible"
		}
		return "hidden"
	}

	getDeleteBtnVisibility(){
		if(this.props.loginInfoObj){
			if(this.props.loginInfoObj._id == this.props.model.creatorId
				//&& this.props.displayType !== "expanded"
				){
				return "visible"
			}
		}
		return "hidden"
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
			case "topWidget":
				if(this.props.displayType == "expanded"){
					__result = "DiscussionWidget_expanded";
				}else{
					__result = "DiscussionWidget";
				}
				break;
			case "content":
				if(this.props.displayType == "expanded"){
					__result = "discussionWidgetContentText_expanded";
				}else{
					__result = "discussionWidgetContentText";
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
			<div className= {this.getClassName("topWidget")}>
				<div className="discussionWidgetVoteContainer">
					<div className="discussionWidgetCountContainer">
		             	<CompPostDepth level={l_depth}/>
	              	</div>
					<div className="discussionWidgetCountContainer">
		             	<CompVoter handleEvent={this.handleEvent}/>
		             	<div style={{backgroundImage:lineSep}}></div>
	              	</div>
	            </div>
	            <div className="discussionWidgetInfoContainer" >
	            	<ol>
		            	<li>

		            		<ol className="discussionWidgetInfoGroupContainer">
			            		<li className="discussionWidgetInfoGroupTitle">{l_model.groupName}</li>
			            		<li className="discussionWidgetInfoGroupUser">{l_model.userName}</li>
			            		<li className="discussionWidgetInfoGroupPostTime">{(new Date(l_model.createdDate)).toLocaleString()}</li>
		            		</ol>
		            	</li>
		            	<li className={this.getClassName("title")} onClick={()=>this.handleEvent({event:ComponentEvent.CLICK})}>
		            	{l_model.title}
		            	</li>
		            	<li className="discussionWidgetContent"  onClick={()=>this.handleEvent({event:ComponentEvent.CLICK})}>
		            		<div className={this.getClassName("content")}>{l_model.description}</div>
		            	</li>
		            	<li>
			            	<div className="discussionWidgetReply">
				        		<ol>
					            	<li>replies: {l_model.childIds.length}</li>
				        			<li>Share</li>
					            	<li>Report</li>
					            	<li><a href="#" onClick={()=>{this.handleEvent({event:"reply",value:null})}} style={{visibility:this.getReplyBtnVisibility()}}>Reply</a></li>
					            	<li><a href="#" onClick={()=>{this.handleEvent({event:"delete",value:null})}} style={{visibility:this.getDeleteBtnVisibility()}}>Delete</a></li>
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
		loginStatus:state.loginContext.loginStatus,
		deleteDiscussionStatus:state.postModel.deleteDiscussionStatus

	}
}

export default connect(mapStateToProps,{ changeScreen, panelNewPostEntry, deleteDiscussion})(DiscussionWidget)