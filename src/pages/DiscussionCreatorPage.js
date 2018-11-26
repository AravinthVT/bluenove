import React, { Component } from 'react';
import DiscussionCreaterWidget from "../widgets/DiscussionCreaterWidget"
import "./DiscussionCreatorPage.css"

export class DiscussionCreatorPage extends Component {
	render() {
		return (
			<div className="DiscussionCreatorPage"><div><DiscussionCreaterWidget/></div></div>
		);
	}
}
export default DiscussionCreatorPage
