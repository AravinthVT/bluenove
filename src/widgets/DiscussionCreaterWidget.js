import React from "react"
import BaseComponent from "../components/BaseComponent"
import CompButton from "../components/CompButton"
import "./DiscussionCreaterWidget.css"

class DiscussionCreaterWidget extends BaseComponent{
	constructor(props){
		super(props);
		props={controller:null};

		this.state = {
			title:"",
			titleErrorMessage:"",
			titleErrorMessageVisibility:"hidden",
			content:"",
			contentErrorMessage:"",
			contentErrorMessageVisibility:"hidden"

		}
		this.updateInputValue 	= this.updateInputValue.bind(this)
		this.isValidEntry		= this.isValidEntry.bind(this)
		this.handleEvent = this.handleEvent.bind(this)

	}

	handleEvent(aEvent){
		console.log("event has been posted");
		try{
			if(this.isValidEntry()){
				console.log("sent a querry to add a user to the model");
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
		if(this.state.content==""){ throw new Error("empty_content")};
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
					<li>Content</li><li><textarea className="DiscussionCreaterWidgetContentInput" placeHolder="Content"/></li>
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