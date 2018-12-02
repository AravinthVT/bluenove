import {FETCH_POSTS, 
	NEW_DISCUSSION, 
	NEW_POSTS, 
	LOGIN_SUCCESS, 
	LOGIN_FAILED, 
	EXPAND_DISCUSSION} from "./types"

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


export function createNewPost(aUserId, aTitle, aDescription, aTags){
	let newPost={
		creatorId:aUserId,
		tags:aTags,
		title:aTitle,
		description:aDescription
	}
	return function(dispatch){
		const aUrl =`http://localhost:3001/create-new-discussion/userid/${aUserId}/title/${aTitle}/description/${aDescription}/tags/${aTags}`
		fetch(aUrl).then((response)=>{
			console.log("Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("Successfully creating new post the discussions");
				//aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE, value:{}});
			}else{
				console.log("TODO handle status issue:"+response.status);
			}
			return response.json();
		}).then((data)=>{
			console.log("CHK: createNewPost: Successfully update the discussions data");
			console.log(data);
			dispatch({type:NEW_DISCUSSION, payload:{status:"success", data:data}});
			return data;
		}).catch((err)=>{
			console.log("CHK: createNewPost: create the new discussion "+err);
			dispatch({type:NEW_DISCUSSION, payload:{status:"failed", data:null}});
			throw err
		})
	}
}


function getAllPosts(aDiscussion, aDepth=0){
	let __allPosts=[];

	console.log("getAllPosts: aDiscussion:::");
	console.log(aDiscussion);
	let __childPosts = aDiscussion.childPosts;
	aDiscussion.depth = aDepth;
	if(__childPosts && __childPosts.length>0){
		__childPosts.forEach((childPost)=>{
			__allPosts.push(childPost);
			__allPosts.push(...getAllPosts(childPost, aDepth+1));
		})
	}
	return __allPosts

}


export function fetchDiscussionByID(aID, aLoginInfoObj){
	console.log("------------fetchDiscussionByID");
	return function(dispatch){
		const aUrl =`http://localhost:3001/discussions/${aID}/userid/${aLoginInfoObj?aLoginInfoObj._id:-1}`
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
			dispatch({type:EXPAND_DISCUSSION, payload:{currentDiscussion:data, data:data, allChildPosts:getAllPosts(data)}});
			return data;
		}).catch((err)=>{
			console.log("CHK: fetchPosts: Could load discussion"+err);
			throw err
		})
	}
}

export function fetchPostById(aID, aLoginInfoObj, parentArray){
	return function(dispatch){
		const aUrl =`http://localhost:3001/post/${aID}`
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
			//dispatch({type:FETCH_POSTS, payload:data.discussions});
			return data;
		}).catch((err)=>{
			console.log("CHK: fetchPosts: Could load discussion"+err);
			throw err
		})
	}
}

