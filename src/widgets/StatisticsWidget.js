import React, { Component } from 'react';
import { connect } from "react-redux";
import "./StatisticsWidget.css"
import CompButton from "../components/CompButton"
import ComponentEvent from "../utils/ComponentEvent"
import {login} from "../actions/loginActions"
import { changeScreen } from "../actions/screenActions"

import { fetchStats } from "../actions/postActions"



import {QUERY_LIFECYCLE_IDLE, QUERY_LIFECYCLE_SENT, QUERY_LIFECYCLE_SUCCESS, QUERY_LIFECYCLE_FAILED} from "../utils/QueryLifeCycle"

export class StatisticsWidget extends Component {
	
	constructor(props){
		super(props);
		this.state = {
		}
//		this.navigateToScreen=this.navigateToScreen.bind(this)
		
	}

	componentWillMount(){
		this.props.fetchStats();
	}

	handleEvent(aEvent){
		console.log("is coming to handleEvent")
		switch(aEvent.type){
			case ComponentEvent.CLICK:
				this.setState({enabled:false})
				this.doLogin();
				break;
			default:
				throw new Error("unknow component event:"+aEvent);
		}
	}

	shouldComponentUpdate(aNextProp, aNextState){
		console.log("shouldComponentUpdate");
		return true;
	}

	//----------------------------------------------------------------------------

	render() {
		console.log("nextScreenID nextScreenID :"+this.props.nextScreenID);
		return (
			<div className="StatisticsWidget">
				<div className="StatisticsWidgetTitle">Total Summary</div>
				<div className="statisticsWidgetGrid">
					<label className="statisticsWidgetGridLabel">Total Discussion</label><div className="statisticsWidgetGridValue">{this.props.totalDiscussions}</div>
					<label className="statisticsWidgetGridLabel">Total Post</label><div className="statisticsWidgetGridValue">{this.props.totalPosts}</div>
					<label className="statisticsWidgetGridLabel">Total Users</label><div className="statisticsWidgetGridValue">{this.props.totalUsers}</div>
				</div>
				<div className="statisticsWidgetLoading" style={{visibility:(this.props.queryLifeCycleStatus==QUERY_LIFECYCLE_SENT?"visible":"hidden")}}>loading..</div>
			</div>
		);
	}
}

const mapStateToProps = (state) =>{
	console.log("StatisticsWidget: mapStateToProps: check the state here");
	console.log(state)
	return {
		totalDiscussions	:state.statiscs.totalDiscussions,
		totalPosts			:state.statiscs.totalPosts,
		totalUsers			:state.statiscs.totalUsers,
		queryLifeCycleStatus		:state.statiscs.queryLifeCycleStatus
	}
}

export default connect(mapStateToProps,{fetchStats})(StatisticsWidget)
