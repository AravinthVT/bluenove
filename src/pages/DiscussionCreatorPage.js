import React, { Component } from 'react';
import DiscussionCreaterWidget from "../widgets/DiscussionCreaterWidget"
import "./DiscussionCreatorPage.css"

export class DiscussionCreatorPage extends Component {
	constructor(props){
		super(props);
		props = {mainModel:null}
	}
	render() {
		return (
			<div className="DiscussionCreatorPage"><div><DiscussionCreaterWidget mainModel = {this.props.mainModel}/></div></div>
		);
	}
}
export default DiscussionCreatorPage
