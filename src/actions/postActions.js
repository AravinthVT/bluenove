import {FETCH_POSTS, NEW_POSTS} from "./types"

export function fetchPosts(){
	return function(dispatch){
		const aUrl ="http://localhost:3001/discussions"
		fetch(aUrl).then((response)=>{
			console.log("Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("Successfully update the discussions");
				//aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE, value:{}});
			}else{
				console.log("TODO handle status issue:"+response.status);
			}
			return response.json();
		}).then((data)=>{
			console.log("CHK: fetchPosts: Successfully update the discussions data");
			console.log(data);
			dispatch({type:FETCH_POSTS, payload:data.discussions});
			return data;
		}).catch((err)=>{
			console.log("CHK: fetchPosts: Could load discussion"+err);
			throw err
		})
	}
}

export function login(aUserName, aPassword){
	return function(dispatch){
		const aUrl =`http://localhost:3001/login/userName/${aUserName}/password/${aPassword}/`
		fetch(aUrl).then((response)=>{
			console.log("login Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("login Successfully update the discussions");
				//aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE, value:{}});
			}else{
				console.log("TODO handle status issue:"+response.status);
			}
			return response.json();
		}).then((data)=>{
			console.log("CHK: login: Successfully update the discussions data");
			console.log(data);
			dispatch({type:FETCH_POSTS, payload:data.discussions});
			return data;
		}).catch((err)=>{
			console.log("CHK: login: Could load discussion"+err);
			throw err
		})
	}
}
