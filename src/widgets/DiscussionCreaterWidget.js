import React from "react"
import { connect } from "react-redux";
import BaseComponent from "../components/BaseComponent"


import CompButton from "../components/CompButton"
import "./DiscussionCreaterWidget.css"
import ModelEvents from "../models/ModelEvents"
import ComponentEvent from "../utils/ComponentEvent"

import { createNewPost } from "../actions/postActions"
import { changeScreen } from "../actions/screenActions"
import {SCREEN_ID_CREATE_NEW_DISCUSSION, SCREEN_ID_HOME} from "../utils/ScreenIDs"

//createNewPost(aUserId, aTitle, aDescription, aTag)

class DiscussionCreaterWidget extends BaseComponent{
	constructor(props){
		super(props);
		//props={controller:null,mainModel:null};

		this.state = {
			title:"",
			titleErrorMessage:"",
			titleErrorMessageVisibility:"hidden",
			content:"",
			contentErrorMessage:"",
			contentErrorMessageVisibility:"hidden",
			tags:"",
			tagsErrorMessage:"",
		}
		this.updateInputValue 	= this.updateInputValue.bind(this)
		this.updateContentValue = this.updateContentValue.bind(this)
		this.updateTagsValue = this.updateTagsValue.bind(this)
		this.isValidEntry		= this.isValidEntry.bind(this)
		this.handleEvent = this.handleEvent.bind(this)
		this.getTitleErrorMessage = this.getTitleErrorMessage.bind(this)
		this.getTagErrorMessage = this.getTagErrorMessage.bind(this)
		this.getContentErrorMessage = this.getContentErrorMessage.bind(this)
		
	}

	componentDidMount(){
		console.log("componentDidMount this.props.mainModel"+this.props.mainModel);
	}

	handleEvent(aEvent){
		console.log("event has been posted");
		console.log("this.props.mainModel"+this.props.mainModel);
		try{
			if(aEvent.event==ComponentEvent.CLICK){
				if(this.isValidEntry()){
					console.log("sent a querry to add a user to the model");
					let obj={title:this.state.title, description:this.state.content};
					this.props.createNewPost(this.props.loginInfoObj._id, this.state.title, this.state.content, "TODO-tag");
					//this.props.mainModel.handleEvent({event:ModelEvents.CREATE_NEW_DISCUSSION,value:obj, target:this})
				}
			}
		}catch(err){
			switch(err.message){
				case "empty_title":
					console.log("Title cannot be empty");
					this.setState({titleErrorMessage:"You missed the title...! it is empty.",titleErrorMessageVisibility:"visible"});
					break;
				case "empty_content":
					console.log("content cannot be empty");
					this.setState({contentErrorMessage:"Opps! you forgot to fill in some content",contentErrorMessageVisibility:"visible"});
					break;
				default:
					throw err
			}
		}
	}

	shouldComponentUpdate(nextProp, nextState){
		if(nextProp.newDiscussionStatus=="success"){
			alert("The disccusion was successfully created");
			this.props.changeScreen(SCREEN_ID_HOME,{loginInfoObj:this.props.loginInfoObj});
		}
		return true
	}

	isValidEntry(){
		console.log("is valid entry:"+this.state.title);
		if(this.state.title.trim().length<=0){ throw new Error("empty_title")};
		if(this.state.content.trim().length<=0){ throw new Error("empty_content")};
		return true;
	}

	updateInputValue(aEvent){
		console.log("updating input value");
		aEvent.preventDefault();
		this.setState({
			title:aEvent.target.value,
			titleErrorMessage:null,
			titleErrorMessageVisibility:"hidden"
		})
	}

	updateContentValue(aEvent){
		console.log("updating input value");
		aEvent.preventDefault();
		this.setState({
			content:aEvent.target.value,
			contentErrorMessage:null,
			contentErrorMessageVisibility:"hidden"
		})
	}

	updateTagsValue(aEvent){
		console.log("updating tag value");
		aEvent.preventDefault();
		this.setState({
			tags:aEvent.target.value,
			tagsErrorMessage:null,
			tagsErrorMessageVisibility:"hidden"
		})
	}

	getTitleErrorMessage(){
		if(this.state.titleErrorMessage=="") return null
		return (<li className="DiscussionCreaterWidgetError" style={{visibility:this.state.titleErrorMessage?"visible":"hidden"}}>{this.state.titleErrorMessage}</li>)
	}

	getTagErrorMessage(){
		return null
		/*return (<li className="DiscussionCreaterWidgetError" style={{visibility:this.state.tagsErrorMessageVisibility}}>{this.state.titleErrorMessage}</li>)*/
	}

	getContentErrorMessage(){
			if(this.state.contentErrorMessageVisibility=="") return null
			return (<li className="DiscussionCreaterWidgetError" style={{visibility:this.state.contentErrorMessageVisibility}}>{this.state.contentErrorMessage}</li>)
	}

	render(){
		return <div className="DiscussionCreaterWidget">
			<h1>CREATE A NEW DISCUSSION</h1>
			<ol>
				<li>
					<ol className="DiscussionCreaterWidgetRow">
					<li>Title</li><li><input className="DiscussionCreaterWidgetTitleInput"  value ={this.state.title} onChange={this.updateInputValue} placeHolder="title"/></li>
					{this.getTitleErrorMessage()}
					</ol>
				</li>
				<li>
					<ol className="DiscussionCreaterWidgetRow">
					<li>Tags</li><li><input className="DiscussionCreaterWidgetTitleInput"  value ={this.state.tags} onChange={this.updateTagsValue } placeHolder="tags"/></li>
					{this.getTagErrorMessage()}
					<li>Please add tags separated by spaces (e.g. music, games, politics)</li>
					</ol>
				</li>

				<li>
					<ol className="DiscussionCreaterWidgetRow">
					<li>Content</li><li><textarea className="DiscussionCreaterWidgetContentInput" placeHolder="Content" onChange={this.updateContentValue}/></li>
					{this.getContentErrorMessage()}
					</ol>
				</li>
				<li>
					<div className="DiscussionCreaterWidgetSubmitBtn"><CompButton value="Post" handleEvent={this.handleEvent}/></div>
				</li>
			</ol>
		</div>
	}
}

const mapStateToProps = (state) =>{
	console.log("LoginWidget: mapStateToProps: check the state here");
	console.log(state)
	return {
		currentScreenID: state.screenContext.screenID,
		nextScreenID:state.screenContext.nextScreenID,
		loginInfoObj:state.loginContext.loginInfoObj,
		loginStatus:state.loginContext.loginStatus,
		newDiscussionStatus:state.discussionCreatorContext.status
	}
}

export default connect(mapStateToProps,{createNewPost, changeScreen})(DiscussionCreaterWidget)