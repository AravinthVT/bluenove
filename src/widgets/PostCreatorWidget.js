import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types"
import ComponentEvent from "../utils/ComponentEvent"
import "./PostCreatorWidget.css"
import BaseComponent from "../components/BaseComponent"
import CompButton from "../components/CompButton"

import { changeScreen, panelNewPostEntry } from "../actions/screenActions"
import { submitPost } from "../actions/postActions"
import { SCREEN_ID_DISCUSSION} from "../utils/ScreenIDs"

export class PostCreatorWidget extends BaseComponent {
	constructor(props){
		super(props);
		this.state={content:""}
		this.handleEvent = this.handleEvent.bind(this);
		this.updateContentText = this.updateContentText.bind(this);
	}

	handleEvent(aEvent){
		//if(this.props.handleEvent==null) return;
		switch(aEvent.event){
			case "submit":
				console.log("Submit from PostWidget");
				this.props.submitPost(this.state.content, {loginInfoObj:this.props.loginInfoObj, discussionID:"5bfdd2141c9d440000681a3e"});
				this.props.panelNewPostEntry({visible:false});
				break;
			case "cancel":
				console.log("Cancel from PostWidget");
				//this.props.changeScreen(SCREEN_ID_DISCUSSION, {loginInfoObj:this.props.loginInfoObj, discussionID:this.props.model._id});
				break;
			default:
				throw Error("unknown event:"+aEvent.event)
		}
	}

	updateContentText(aEvent){
		this.setState({content:aEvent.target.value});

	}

	render() {
		if(this.props.panelVisible==false) return null;	
		return (
			<div className="PostCreatorWidget">
				<ol>
					<li>
						<div className="postCreatorWidgetTitle">Please enter a comment to submit</div>
					</li>
					<li>
						<textarea className="postCreatorWidgetTextArea">{this.state.content}</textarea>
					</li>
					<li>
						<div className="postCreatorWidgetBtnContainer">
							<ol>
								<li>
									<CompButton value="Submit" wdith="150px" handleEvent={()=>this.handleEvent({event:"submit"})}/>
								</li>
								<li>
									<CompButton value="Cancel" wdith="150px" handleEvent={()=>this.handleEvent({event:"cancel"})}/>
								</li>
							</ol>
						</div>
					</li>
				</ol>
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
		loginStatus:state.loginContext.loginStatus,
		panelVisible:state.screenContext.panelNewPostEntryProps.visible
	}
}

export default connect(mapStateToProps,{ changeScreen, panelNewPostEntry})(PostCreatorWidget)