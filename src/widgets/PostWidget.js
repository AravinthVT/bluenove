import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types"
import ComponentEvent from "../utils/ComponentEvent"
import "./PostWidget.css"
import BaseComponent from "../components/BaseComponent"
import CompPostDepth from "../components/CompPostDepth"
import CompVoter from "../components/CompVoter"
import lineSep from "../images/lineSep3.svg"
import { changeScreen } from "../actions/screenActions"
import { deletePost } from "../actions/postActions"

import { SCREEN_ID_DISCUSSION} from "../utils/ScreenIDs"


export class PostWidget extends BaseComponent {
	constructor(props){
		super(props);
		this.state={height:"200px"}
		this.handleEvent = this.handleEvent.bind(this);
		this.getReplyBtnVisibility = this.getReplyBtnVisibility.bind(this);
		this.getDeleteBtnVisibility = this.getDeleteBtnVisibility.bind(this);
	}

	handleEvent(aEvent){
		//if(this.props.handleEvent==null) return;
		switch(aEvent.event){
			case ComponentEvent.VOTE_UP:
				console.log("Voting up from PostWidget");
				//this.props.handleEvent(aEvent)
				break;
			case ComponentEvent.VOTE_DOWN:
				console.log("Voting up from PostWidget");
				//this.props.handleEvent(aEvent)
				break;
			case ComponentEvent.CLICK:
				console.log("Selected from PostWidget");
				//this.props.handleEvent(aEvent)
				//this.props.changeScreen(SCREEN_ID_DISCUSSION, {loginInfoObj:this.props.loginInfoObj, discussionID:this.props.model._id});
				break;
			case "reply":
				console.log("CHK: PostWidget: reply: -----");
				
				break;
			case "delete":
				console.log("CHK: PostWidget: delete: ------id:"+this.props.model._id);
				this.props.deletePost(this.props.model._id);
				break;
			default:
				throw Error("unknown event:"+aEvent.event)
		}
	}

	getReplyBtnVisibility(){
		//if(this.props.displayType !== "expanded"){
				return "visible"
		//}
		//return "hidden"
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

	render() {
		
		const l_model = this.props.model;
		console.log("______________ post model")
		console.log(l_model);
		if(l_model==null) return null;
		let l_depth =l_model.depth;
		//<div style={{backgroundImage:lineSep}}>
		//<div className="postWidgetVoteContainer">
		//</div>
		return (
			<div className="PostWidget" style=
    {{display: "grid",
    gridTemplateColumns: "20px 20px auto"}}>
				<div className="postWidgetCountContainer">
	             	<CompPostDepth level={l_depth}/>
              	</div>
				<div className="postWidgetCountContainer grid_container">
	             	<CompVoter handleEvent={this.handleEvent}/>
	             	<div className="postWidgetCountContainer_line">
              		</div>
              	</div>
	            <div className="postWidgetInfoContainer" >
	            	<ol>
		            	<li>
		            		<ol className="postWidgetInfoGroupContainer">
		            		<li className="postWidgetInfoGroupTitle">{l_model.groupName}</li>
		            		<li className="postWidgetInfoGroupUser">{l_model.userName}</li>
		            		<li className="postWidgetInfoGroupPostTime">{(new Date(l_model.createdDate)).toLocaleString()}</li>
		            		</ol>
		            	</li>
		            	<li className="postWidgetContent" >
		            	{l_model.content}
		            	</li>
		            	<li>
			            	<div className="postWidgetReply">
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

/*PostWidget.propTypes = {
	level:PropTypes.number
}
*/
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

export default connect(mapStateToProps,{deletePost, changeScreen})(PostWidget)