import React, { Component } from 'react';
import { connect } from "react-redux";
import DiscussionExpandedWidget from "../widgets/DiscussionExpandedWidget"
import "./DiscussionPage.css"

export class DiscussionPage extends Component {
	render() {
		return (
			<div className="DiscussionPage">
				<DiscussionExpandedWidget discussionID={this.props.discussionID}/>
			</div>
		);
	}
}

const mapStateToProps = (state) =>{
	console.log("LoginWidget: mapStateToProps: check the state here");
	console.log(state)
	return {
		currentScreenID : state.screenContext.screenID,
		nextScreenID 	:state.screenContext.nextScreenID,
		loginInfoObj 	:state.loginContext.loginInfoObj,
		loginStatus 	:state.loginContext.loginStatus,
		discussionID 	:state.screenContext.discussionID,
	}
}

export default connect(mapStateToProps,{})(DiscussionPage)