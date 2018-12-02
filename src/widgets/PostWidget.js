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

import { SCREEN_ID_DISCUSSION} from "../utils/ScreenIDs"


export class PostWidget extends BaseComponent {
	constructor(props){
		super(props);
		this.state={height:"200px"}
		this.handleEvent = this.handleEvent.bind(this);
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
				this.props.changeScreen(SCREEN_ID_DISCUSSION, {loginInfoObj:this.props.loginInfoObj, discussionID:this.props.model._id});
				break;
			default:
				throw Error("unknown event:"+aEvent.event)
		}
	}

	render() {
		
		const l_model = this.props.model;
		console.log("______________ post model")
		console.log(l_model);
		if(l_model==null) return null;
		let l_depth =l_model.depth;
		return (
			<div className="PostWidget">
				<div className="postWidgetVoteContainer">
					<div className="postWidgetCountContainer">
		             	<CompPostDepth level={l_depth}/>
	              	</div>
					<div className="postWidgetCountContainer">
		             	<CompVoter handleEvent={this.handleEvent}/>
		             	<div style={{backgroundImage:lineSep}}>
	              		</div>
	              	</div>
	            </div>
	            <div className="postWidgetInfoContainer" >
	            	<ol>
		            	<li>
		            		<ol className="postWidgetInfoGroupContainer">
		            		<li className="postWidgetInfoGroupTitle">{l_model.groupName}</li>
		            		<li className="postWidgetInfoGroupUser">{l_model.userName}</li>
		            		<li className="postWidgetInfoGroupPostTime">{l_model.createdDate}</li>
		            		</ol>
		            	</li>
		            	<li className="postWidgetContent" onClick={()=>this.handleEvent({event:ComponentEvent.CLICK})}>
		            	{l_model.content}
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

export default connect(mapStateToProps,{ changeScreen})(PostWidget)