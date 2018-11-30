import React from 'react';
import DiscussionWidget from "../widgets/DiscussionWidget"
import CompButton from "../components/CompButton"
import BaseComponent from "../components/BaseComponent"
import ComponentEvent from "../utils/ComponentEvent"
import "./MainPage.css"
import { connect } from 'react-redux'
import { fetchPosts } from "../actions/postActions"

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
		//this.fetchData = this.fetchData.bind(this);
	}

	componentDidMount(){
		console.log("component mounted");
		//this.fetchData();
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

	
	//this.state.discussions
	render() {
		//const newObj=this.state.discussions[0]
		if(this.state.discussions == null) return null;
		return (
			<div className="MainPage">
				<CompButton value="Create Post" handleEvent={()=>this.handleEvent({event:ComponentEvent.SCREEN_CHANGE,value:"DiscussionCreatorPage"})}/>
				<div>
					{this.props.discussions.map((item, index)=>{
						return <DiscussionWidget key={index} depth="0" model={item}/>
					})}
				</div>
         	</div>
		);
	}
}

const mapStateToProps = state =>({
		discussions: state.posts.items
})
export default connect(mapStateToProps, {fetchPosts})(MainPage)