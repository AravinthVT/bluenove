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
				this.createNewDiscussion(this.getUrl("create-new-discussion/title",escape(aEvent.value.title),"description",escape(aEvent.value.description)));
				break;
			case ModelEvent.LOAD_HOME_DISCUSSIONS:
				this.createNewDiscussion(this.getUrl("/discussions"));
				break;
			default:
				throw new Error("unknow model event : "+aEvent);
		}
	}

	createNewDiscussion(aUrl){
		fetch(aUrl).then((response)=>{
			console.log(response);
		})
	}

	render() {
		return (
			<div></div>
		);
	}

	


}
export default MainModel