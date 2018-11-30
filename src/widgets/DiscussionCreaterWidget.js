import React from "react"
import BaseComponent from "../components/BaseComponent"
import CompButton from "../components/CompButton"
import "./DiscussionCreaterWidget.css"
import ModelEvents from "../models/ModelEvents"
import ComponentEvent from "../utils/ComponentEvent"

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
			contentErrorMessageVisibility:"hidden"

		}
		this.updateInputValue 	= this.updateInputValue.bind(this)
		this.updateContentValue = this.updateContentValue.bind(this)
		this.isValidEntry		= this.isValidEntry.bind(this)
		this.handleEvent = this.handleEvent.bind(this)
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
					this.props.mainModel.handleEvent({event:ModelEvents.CREATE_NEW_DISCUSSION,value:obj, target:this})
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

	render(){
		return <div className="DiscussionCreaterWidget">
			<ol>
				<li>
					<ol className="DiscussionCreaterWidgetRow">
					<li>Title</li><li><input className="DiscussionCreaterWidgetTitleInput"  value ={this.state.title} onChange={this.updateInputValue} placeHolder="Title"/></li>
					<li className="DiscussionCreaterWidgetError" style={{visibility:this.state.titleErrorMessage?"visible":"hidden"}}>{this.state.titleErrorMessage}</li>
					</ol>
				</li>

				<li>
					<ol className="DiscussionCreaterWidgetRow">
					<li>Content</li><li><textarea className="DiscussionCreaterWidgetContentInput" placeHolder="Content" onChange={this.updateContentValue}/></li>
					<li className="DiscussionCreaterWidgetError" style={{visibility:this.state.contentErrorMessageVisibility}}>{this.state.contentErrorMessage}</li>
					</ol>
				</li>
				<li>
					<div className="DiscussionCreaterWidgetSubmitBtn"><CompButton value="Post" handleEvent={this.handleEvent}/></div>
				</li>
			</ol>
		</div>
	}
}
export default DiscussionCreaterWidget