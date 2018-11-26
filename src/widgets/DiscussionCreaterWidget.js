import React from "react"
import BaseComponent from "../components/BaseComponent"
import CompButton from "../components/CompButton"
import "./DiscussionCreaterWidget.css"

class DiscussionCreaterWidget extends BaseComponent{
	render(){
		return <div className="DiscussionCreaterWidget">
			<ol>
				<li>
					<ol className="DiscussionCreaterWidgetRow"><li>Title</li><li><input className="DiscussionCreaterWidgetTitleInput"/></li></ol>
				</li>

				<li>
					<ol className="DiscussionCreaterWidgetRow"><li>Content</li><li><textarea className="DiscussionCreaterWidgetContentInput" /></li></ol>
				</li>
				<li>
					<div className="DiscussionCreaterWidgetSubmitBtn"><CompButton value="Post" handleEvent={this.handleEvent}/></div>
				</li>
			</ol>
		</div>
	}
}
export default DiscussionCreaterWidget