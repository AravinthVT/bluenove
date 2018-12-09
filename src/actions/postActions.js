import {FETCH_POSTS, 
	NEW_DISCUSSION, 
	NEW_POSTS,
	INSERT_POST, 
	LOGIN_SUCCESS, 
	LOGIN_FAILED, 
	EXPAND_DISCUSSION,
	DELETE_DISCUSSION,
	DELETE_POST,
	FETCH_STAT} from "./types"

import {QUERY_LIFECYCLE_IDLE, QUERY_LIFECYCLE_SENT, QUERY_LIFECYCLE_SUCCESS, QUERY_LIFECYCLE_FAILED} from "../utils/QueryLifeCycle"

export const __url="http://localhost:3001"

export function fetchPosts(){
	return function(dispatch){
		const aUrl =__url+"/discussions"
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

//this is to create new discussion
export function createNewDiscussion(aUserId, aTitle, aDescription, aTags){
	let newPost={
		creatorId:aUserId,
		tags:aTags,
		title:aTitle,
		description:aDescription
	}
	return function(dispatch){
		const aUrl =`${__url}/create-new-discussion/userid/${aUserId}/title/${encodeURIComponent(aTitle)}/description/${encodeURIComponent(aDescription)}/tags/${encodeURIComponent(aTags)}`
		fetch(aUrl).then((response)=>{
			console.log("Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("Successfully creating new post the discussions");
				return response.json();
				//aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE, value:{}});
			}else{
				console.log("TODO handle status issue:"+response.status);
				//alert("Couldnt create the new discussion");
				return null;
			}
		}).then((data)=>{
			console.log("CHK: createNewDiscussion: Successfully update the discussions data");
			console.log(data);
			dispatch({type:NEW_DISCUSSION, payload:{status:"success", data:data}});
			dispatch({type:NEW_DISCUSSION, payload:{status:"init", data:data}});
			return data;
		}).catch((err)=>{
			console.log("CHK: createNewDiscussion: create the new discussion "+err);
			dispatch({type:NEW_DISCUSSION, payload:{status:"failed", data:null}});
			dispatch({type:NEW_DISCUSSION, payload:{status:"init", data:null}});
			throw err
		})
	}
}

//this is to create new discussion
export function deleteDiscussion(aDiscussionId){
	return function(dispatch){
		dispatch({type:DELETE_DISCUSSION, payload:{deleteDiscussionStatus: QUERY_LIFECYCLE_SENT}});
		const aUrl =`${__url}/delete-discussion/discussionId/${aDiscussionId}`
		fetch(aUrl).then((response)=>{
			console.log("Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("deleteDiscussion: Successfully got a response");
				return response.json();
				//aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE, value:{}});
			}else{
				console.log("deleteDiscussion: Failed to get a response");
				console.log("TODO handle status issue:"+response.status);
				//alert("Couldnt create the new discussion");
				return null;
			}
		}).then((data)=>{
			console.log("CHK: createNewDiscussion: Successfully update the discussions data");
			console.log(data);
			if(data && data.deleteStatus=="success"){
				dispatch({type:DELETE_DISCUSSION, payload:{...data, deleteDiscussionStatus: QUERY_LIFECYCLE_SUCCESS}});
				dispatch({type:DELETE_DISCUSSION, payload:{...data, deleteDiscussionStatus: QUERY_LIFECYCLE_IDLE}});
			//dispatch({type:DELETE_DISCUSSION, payload:{status:"success", data:data}});
			//dispatch({type:DELETE_DISCUSSION, payload:{status:"init", data:data}});
				return data;
			}else{
				dispatch({type:DELETE_DISCUSSION, payload:{...data, deleteDiscussionStatus: QUERY_LIFECYCLE_FAILED}});
				dispatch({type:DELETE_DISCUSSION, payload:{...data, deleteDiscussionStatus: QUERY_LIFECYCLE_IDLE}});
				throw new Error("Problem deleting")
			}
		}).catch((err)=>{
			console.log("CHK: createNewDiscussion: create the new discussion "+err);
			//dispatch({type:DELETE_DISCUSSION, payload:{status:"failed", data:null}});
			//dispatch({type:DELETE_DISCUSSION, payload:{status:"init", data:null}});
			throw err
		})
	}
}



export function submitPost(userId, aContent, aParentDiscussionId, aParentType){
	//if(aLoginInfoObj){
		/*
		let newPost={
			content: aContent,
			parentId: aParentDiscussionId,
			creatorId:aLoginInfoObj._id,
			createdDate:Date.now(),
			childIds:[]
		}
		*/
	//}
	
	return function(dispatch){
		const aUrl =`${__url}/create-new-post/userid/${userId}/content/${encodeURIComponent(aContent)}/parentId/${encodeURIComponent(aParentDiscussionId)}/parentType/${encodeURIComponent(aParentType)}`
		dispatch({type:INSERT_POST, payload:{insertStatus:QUERY_LIFECYCLE_SENT}});
		fetch(aUrl).then((response)=>{
			console.log("Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("Successfully creating new post the discussions");
				//aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE, value:{}});
				return response.json();
			}else{
				console.log("TODO handle status issue:"+response.status);
				return null;
			}
			
		}).then((insertResult)=>{
			
			console.log(insertResult);
			if(insertResult && insertResult.insertStatus == "success"){
				console.log("CHK: createNewDiscussion: Successfully update the discussions data");
				dispatch({type:INSERT_POST, payload:{insertStatus:QUERY_LIFECYCLE_SUCCESS}});
				dispatch({type:INSERT_POST, payload:{insertStatus:QUERY_LIFECYCLE_IDLE}});
			}else{
				dispatch({type:INSERT_POST, payload:{insertStatus:QUERY_LIFECYCLE_FAILED, insertPostStatusMessage:"Couldn't insert document"}});
				dispatch({type:INSERT_POST, payload:{insertStatus:QUERY_LIFECYCLE_IDLE}});
			}
			return true;
		}).catch((err)=>{
			console.log("CHK: createNewDiscussion: create the new discussion "+err);
			dispatch({type:INSERT_POST, payload:{insertStatus:QUERY_LIFECYCLE_FAILED}});
			dispatch({type:INSERT_POST, payload:{insertStatus:QUERY_LIFECYCLE_IDLE}});
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
	let count=0;
	if(__childPosts && __childPosts.length>0){
		__childPosts.forEach((childPost)=>{
			console.log("**************** count:"+count);
			if(childPost){
				__allPosts.push(childPost);
				__allPosts.push(...getAllPosts(childPost, aDepth+1));
				count++;
			}
		})
	}
	return __allPosts

}


export function fetchDiscussionByID(aID, aLoginInfoObj){
	console.log("------------fetchDiscussionByID");
	return function(dispatch){
		dispatch({type:EXPAND_DISCUSSION, payload:{status:QUERY_LIFECYCLE_SENT, currentDiscussion:null, data:null, allChildPosts:[]}});
		const aUrl =`${__url}/discussions/${aID}/userid/${aLoginInfoObj?aLoginInfoObj._id:-1}`
		fetch(aUrl).then((response)=>{
			console.log("Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("Successfully update the discussions");
				//aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE, value:{}});
				return response.json();
			}else{
				console.log("TODO handle status issue:"+response.status);
				return null;
			}
			
		}).then((data)=>{
			console.log("CHK: fetchPosts: Successfully update the discussions data");
			console.log(data);
			if(data){
				dispatch({type:EXPAND_DISCUSSION, payload:{status: QUERY_LIFECYCLE_SUCCESS, currentDiscussion:data, data:data, allChildPosts:getAllPosts(data)}});
				dispatch({type:EXPAND_DISCUSSION, payload:{status: QUERY_LIFECYCLE_IDLE, currentDiscussion:data, data:data, allChildPosts:getAllPosts(data)}});
			}else{
				dispatch({type:EXPAND_DISCUSSION, payload:{status: QUERY_LIFECYCLE_FAILED, currentDiscussion:data, data:data, allChildPosts:getAllPosts(data)}});
				dispatch({type:EXPAND_DISCUSSION, payload:{status: QUERY_LIFECYCLE_IDLE, currentDiscussion:data, data:data, allChildPosts:getAllPosts(data)}});
			}
			return data;
		}).catch((err)=>{
			console.log("CHK: fetchPosts: Could load discussion"+err);
			throw err
		})
	}
}

export function fetchPostById(aID, aLoginInfoObj, parentArray){
	return function(dispatch){
		const aUrl =`${__url}/post/${aID}`
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

export function fetchStats(aID, aLoginInfoObj){
	console.log("------------fetchStats");
	return function(dispatch){
		dispatch({type:FETCH_STAT, payload:{queryLifeCycleStatus:QUERY_LIFECYCLE_SENT, totalDiscussions:null, totalPosts:null, totalUsers:null}});
		const aUrl =`${__url}/stat`
		fetch(aUrl).then((response)=>{
			console.log("Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("Successfully update the discussions");
				//aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE, value:{}});
				return response.json();
			}else{
				console.log("TODO handle status issue:"+response.status);
				return null;
			}
			
		}).then((statData)=>{
			console.log("CHK: fetchPosts: Successfully update the discussions statData");
			console.log(statData);
			if(statData){
				dispatch({type:FETCH_STAT, payload:{queryLifeCycleStatus: QUERY_LIFECYCLE_SUCCESS, totalDiscussions:statData.totalDiscussions, totalPosts:statData.totalPosts, totalUsers:statData.totalUsers}});
				dispatch({type:FETCH_STAT, payload:{queryLifeCycleStatus: QUERY_LIFECYCLE_IDLE}});
			}else{
				dispatch({type:FETCH_STAT, payload:{queryLifeCycleStatus: QUERY_LIFECYCLE_FAILED, totalDiscussions:statData.totalDiscussions, totalPosts:statData.totalPosts, totalUsers:statData.totalUsers}});
				dispatch({type:FETCH_STAT, payload:{queryLifeCycleStatus: QUERY_LIFECYCLE_IDLE}});
			}
			return statData;
		}).catch((err)=>{
			console.log("CHK: fetchPosts: Could load discussion"+err);
			throw err
		})
	}
}


//this is to create new post
export function deletePost(aPostId){
	console.log("CHK: deletePost: aPostId:"+aPostId);
	return function(dispatch){
		dispatch({type:DELETE_POST, payload:{deletePostStatus: QUERY_LIFECYCLE_SENT}});
		const aUrl =`${__url}/delete-post/postId/${aPostId}`
		fetch(aUrl).then((response)=>{
			console.log("Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("deletePost: Successfully got a response");
				return response.json();
				//aEvent.target.handleEvent({event:ModelEvent.LOAD_HOME_DISCUSSIONS_COMPLETE, value:{}});
			}else{
				console.log("deletePost: Failed to get a response");
				console.log("TODO handle status issue:"+response.status);
				//alert("Couldnt create the new post");
				return null;
			}
		}).then((data)=>{
			console.log("CHK: createNewPost: Successfully update the posts data");
			console.log(data);
			if(data && data.deleteStatus=="success"){
				dispatch({type:DELETE_POST, payload:{...data, deletePostStatus: QUERY_LIFECYCLE_SUCCESS}});
				dispatch({type:DELETE_POST, payload:{...data, deletePostStatus: QUERY_LIFECYCLE_IDLE}});
				return data;
			}else{
				dispatch({type:DELETE_POST, payload:{...data, deletePostStatus: QUERY_LIFECYCLE_FAILED}});
				dispatch({type:DELETE_POST, payload:{...data, deletePostStatus: QUERY_LIFECYCLE_IDLE}});
				//throw new Error("Problem deleting");
				return data;
			}
		}).catch((err)=>{
			console.log("CHK: createNewPost: create the new post "+err);
			//dispatch({type:DELETE_POST, payload:{status:"failed", data:null}});
			//dispatch({type:DELETE_POST, payload:{status:"init", data:null}});
			throw err
		})
	}
}
