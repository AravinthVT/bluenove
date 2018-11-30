import React, { Component } from 'react';
import "./PageLoader.css"
import { connect } from "react-redux";

import MainPage from "../pages/MainPage"
import DiscussionPage from "../pages/DiscussionPage"
import DiscussionCreatorPage from "../pages/DiscussionCreatorPage"
import LoginPage from "../pages/LoginPage"

import {SCREEN_ID_HOME, SCREEN_ID_CREATE_NEW_DISCUSSION, SCREEN_ID_LOGIN} from "../utils/ScreenIDs"

export class PageLoader extends Component {
	constructor(props){
		super(props);
		this.state = {
			currentScreenID:SCREEN_ID_HOME
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		console.log("PageLoader: shouldComponentUpdate ############# ");
		return true;
	}

	getCurPage(){
		//this.state.currentScreenID
	    switch(this.props.currentScreenID){
	      case SCREEN_ID_HOME:
	        return (<MainPage mainModel={this.state.mainModel} handleEvent={this.handleEvent}/>)
	      case "DiscussionPage":
	        return (<DiscussionPage mainModel={this.state.mainModel} handleEvent={this.handleEvent}/>)
	      case SCREEN_ID_CREATE_NEW_DISCUSSION:
	        return (<DiscussionCreatorPage mainModel={this.state.mainModel} handleEvent={this.handleEvent}/>)
	      case SCREEN_ID_LOGIN:
	       	return (<LoginPage mainModel={this.state.mainModel} handleEvent={this.handleEvent}/>)
	      default:
	        throw Error("unknow screen name "+this.state.currentScreenID);
	    }
	}

	render() {
		return (
			<div className="PageLoader">{this.getCurPage()}</div>
		);
	}
}

const mapStateToProps = (state) =>{
	console.log("PageLoader check the state here");
	console.log(state)
	return {
		currentScreenID: state.screenContext.screenID
	}
}

export default connect(mapStateToProps,{})(PageLoader)