import React from 'react';
import PropTypes from "prop-types"
import DiscussionWidget from "../widgets/DiscussionWidget"
import CompButton from "../components/CompButton"
import BaseComponent from "../components/BaseComponent"
import ComponentEvent from "../utils/ComponentEvent"
import "./MainPage.css"
import { connect } from 'react-redux'
import { fetchPosts } from "../actions/postActions"
import { changeScreen } from "../actions/screenActions"
import {SCREEN_ID_CREATE_NEW_DISCUSSION} from "../utils/ScreenIDs"

import DiscussionCreaterWidget from "../widgets/DiscussionCreaterWidget"

export class MainPage extends BaseComponent {
	constructor(props){
		super(props);
		//props = {screenContext:null}
		this.state={discussions:Array(10).fill({
			id:-1,
			groupName:"defaultGroupName",
			userName:"guest",
			createdDate:"new Date()",
			content:"default content from parent"
		})}
		//this.fetchData = this.fetchData.bind(this);
	}

	componentDidMount(){
		console.log("component mounted");
		this.props.fetchPosts();
	}

	/*fetchData(){
		fetch("http://localhost:3001/discussions").then((response)=>{
			console.log("********************");
			response.json().then((valueObj)=>{
				console.log(valueObj);
				console.log("valueObj.discussions")
				console.log(valueObj.discussions)
				this.setState({discussions:valueObj.discussions});
			});
		});
	}*/

	handleEvent(aEvent){
		switch(aEvent.type){
			case ComponentEvent.SCREEN_CHANGE:
				console.log("trying to change screen");
				this.props.changeScreen(SCREEN_ID_CREATE_NEW_DISCUSSION, {})
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		console.log("shouldComponentUpdate ############# "+this.props.screenContext);
		return true;
	}

	
	//this.state.discussions
	render() {
		console.log("############# "+this.props.screenContext);
		console.log(this.props.screenContext);
		//const newObj=this.state.discussions[0]
		//<p1>{this.props.screenContext.screenID}</p1>
		//<p1>{this.props.screenContext.screenID}</p1>
		//<div><DiscussionCreaterWidget/></div>

		if(this.state.discussions == null) return null;
		return (
			<div className="MainPage">
				<div>
					<CompButton value="Create Post" handleEvent={()=>this.handleEvent({type:ComponentEvent.SCREEN_CHANGE,value:"DiscussionCreatorPage"})}/>
					<div>
						{this.props.discussions.map((item, index)=>{
							return <DiscussionWidget key={index} depth="0" model={item}/>
						})}
					</div>
				</div>
         	</div>
		);
	}
}



const mapStateToProps = (state) =>{
	console.log("check the state here");
	console.log(state)
		return {
		discussions: state.posts.items,
		screenContext: state.screenContext
	}
}

export default connect(mapStateToProps, {fetchPosts, changeScreen})(MainPage)