import React, { Component } from 'react';
import { connect } from "react-redux";
import StatisticsWidget from "../widgets/StatisticsWidget"
import "./StatisticsPage.css"

export class StatisticsPage extends Component {
	render() {
		return (
			<div className="StatisticsPage">
				<StatisticsWidget/>
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

export default connect(mapStateToProps,{})(StatisticsPage)