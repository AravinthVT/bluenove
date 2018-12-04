import React from "react"
import { connect } from "react-redux";
import BaseComponent from "../components/BaseComponent"


import CompButton from "../components/CompButton"
import DiscussionWidget from "../widgets/DiscussionWidget"
import PostWidget from "../widgets/PostWidget"
import PostCreatorWidget from "../widgets/PostCreatorWidget"
import "./DiscussionExpandedWidget.css"
import ModelEvents from "../models/ModelEvents"
import ComponentEvent from "../utils/ComponentEvent"

import { fetchDiscussionByID } from "../actions/postActions"
import { changeScreen } from "../actions/screenActions"
import {SCREEN_ID_CREATE_NEW_DISCUSSION, SCREEN_ID_HOME} from "../utils/ScreenIDs"
import {QUERY_LIFECYCLE_IDLE, QUERY_LIFECYCLE_SENT, QUERY_LIFECYCLE_SUCCESS, QUERY_LIFECYCLE_FAILED} from "../utils/QueryLifeCycle"


class DiscussionExpandedWidget extends BaseComponent{
	constructor(props){
		super(props);
		props= {discussionID:0}

		this.state = {
			title:"",
			titleErrorMessage:""
		}
		//this.updateInputValue 	= this.updateInputValue.bind(this)
		this.getAllPosts =this.getAllPosts.bind(this);
		this.getPostCreatorVisibility =this.getPostCreatorVisibility.bind(this);
		
		
	}

	componentDidMount(){
		console.log("componentDidMount this.props.discussionID"+this.props.discussionID);
		this.props.fetchDiscussionByID(this.props.discussionID, this.props.loginInfoObj);
	}

	handleEvent(aEvent){
		console.log("event has been posted");
		try{
			if(aEvent.event==ComponentEvent.CLICK){
				console.log("goto home");
				this.props.changeScreen(SCREEN_ID_HOME, this.props.loginInfoObj);
			}
		}catch(err){
			
		}
	}

	shouldComponentUpdate(nextProp, nextState){
		if(this.props.insertPostStatus == QUERY_LIFECYCLE_SUCCESS){
			this.props.fetchDiscussionByID(this.props.discussionID, this.props.loginInfoObj);
		}
		return true
	}


	getAllPosts(){
		let result = null
		if(this.props.allChildPosts && this.props.allChildPosts.length>0){
			result = this.props.allChildPosts.map((obj,index)=>{
				return <li key={index}><PostWidget  model={obj}/></li>
			})
		}
		return result;
	}

	getPostCreatorVisibility(){

	}

	render(){
		console.log("this.props.currentDiscussion");
		console.log(this.props.currentDiscussion);
		return <div className="DiscussionExpandedWidget">
			<ol>
				<li>
					<div className="discussionExpandedWidgetCloseBtnCntr"><CompButton value="Close" handleEvent={this.handleEvent}/></div>
				</li>
				<li>
					<DiscussionWidget model={this.props.currentDiscussion} displayType="expanded"/>
				</li>
					{this.getAllPosts()}
				<li>
					<PostCreatorWidget style={{visibility:(true)}}/>
				</li>
			</ol>
		</div>
	}
}

const mapStateToProps = (state) =>{
	console.log("DiscussionExpandedWidget: mapStateToProps: check the state here");
	console.log(state)
	return {
		currentScreenID : state.screenContext.screenID,
		nextScreenID 	: state.screenContext.nextScreenID,
		loginInfoObj 	: state.loginContext.loginInfoObj,
		loginStatus		: state.loginContext.loginStatus,
		discussionID 	: state.screenContext.discussionID,
		currentDiscussion: state.discussionExpandedContext.currentDiscussion,
		allChildPosts	: state.discussionExpandedContext.allChildPosts,
		insertPostStatus 		: state.postModel.insertPostStatus

	}
}

export default connect(mapStateToProps,{changeScreen, fetchDiscussionByID})(DiscussionExpandedWidget)

