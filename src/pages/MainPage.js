import React, { Component } from 'react';
import DiscussionWidget from "../widgets/DiscussionWidget"
import CompButton from "../components/CompButton"
import BaseComponent from "../components/BaseComponent"
import ComponentEvent from "../utils/ComponentEvent"
import "./MainPage.css"

export class MainPage extends BaseComponent {
	constructor(props){
		super(props);
		this.state={discussions:Array(10).fill({
			id:-1,
			groupName:"defaultGroupName",
			userName:"guest",
			createdDate:"new Date()",
			content:"default content from parent"
		})}

	}
	
	render() {
		const newObj=this.state.discussions[0]
		return (
			<div className="MainPage">
				<CompButton value="Create Post" handleEvent={()=>this.handleEvent({event:ComponentEvent.SCREEN_CHANGE,value:"DiscussionCreatorPage"})}/>
				<div>
					{this.state.discussions.map((item)=>{
						return <DiscussionWidget depth="0" model={item}/>
					})}
				</div>
         	</div>
		);
	}
}
export default MainPage