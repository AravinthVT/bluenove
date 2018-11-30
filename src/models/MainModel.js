import React, { Component } from 'react';
import ModelEvent from "./ModelEvents";

export class MainModel extends Component {

	constructor(props){
		super(props);
		this.url = "http://localhost:3001"
	}

	getUrl(...aSubRoute){
		let str = this.url+"/"+aSubRoute.join("/");
		console.log("s:"+str);
		return str
	}

	handleEvent(aEvent){
		switch(aEvent.event){
			case ModelEvent.CREATE_NEW_DISCUSSION:
				console.log("TEST: MainModel to create new discussion");
				console.log(aEvent.value);
				let url = this.getUrl("create-new-discussion/userid", 'aEvent.value.user_id', "title",escape(aEvent.value.title), "description", escape(aEvent.value.description));
				console.log(url);
				this.createNewDiscussion(url, aEvent);
				break;
			case ModelEvent.LOAD_HOME_DISCUSSIONS:
				this.loadHomeDiscussions(this.getUrl("/discussions"), aEvent);
				break;
			default:
				throw new Error("unknow model event : "+aEvent);
		}
	}

	loadHomeDiscussions(aUrl, aEvent){
		fetch(aUrl).then((response)=>{
			if(response.status== "200"){
				console("Successfully update the discussions");
				aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE,value:{}});
			}
		}).catch((err)=>{
			console.log("Could not create the new discussion");
		})
	}

	createNewDiscussion(aUrl){
		fetch(aUrl).then((response)=>{
			console.log(response);
			console.log("status:"+response.status);
			console.log("text  :"+response.text());
			if(response.status== "200"){
				//alert("Successfully update the post");
			}
		}).catch((err)=>{
			console.log("Could not create the new discussion");
		})
	}

	render() {
		return (
			<div></div>
		);
	}

	


}
export default MainModel