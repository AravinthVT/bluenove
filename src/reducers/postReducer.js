import {FETCH_POSTS, NEW_DISCUSSION, NEW_POSTS, INSERT_POST, LOGIN_SUCCESS, LOGIN_FAILED, EXPAND_DISCUSSION} from "../actions/types"

const initialState = {
	items:[],
	item:{},
	currentDiscussion:null
}

export default function(state=initialState, actions){
	console.log("CHK: postReducer: entry");
	switch(actions.type){
		case FETCH_POSTS:
			console.log("CHK: postReducer: reaches here 22");
			return {
				...state,
				items	:actions.payload
			}
		case NEW_DISCUSSION:
			console.log("CHK: postReducer: reaches here 22");
			return {
				...state,
				status	:actions.payload.status,
				data	:actions.payload.data
			}
		case EXPAND_DISCUSSION:
			
			console.log("CHK: postReducer: reaches here 22");
			return {
				...state,
				status	:actions.payload.status,
				data	:actions.payload.data,
				currentDiscussion:actions.payload.currentDiscussion,
				allChildPosts:actions.payload.allChildPosts
			}
		case INSERT_POST:
			console.log("CHK: postReducer: reaches here 22");
			return {
				...state,
				insertPostStatus	:actions.payload.insertStatus
			}
		/*case LOGIN_SUCCESS:
			return {
				...state,
				loginInfoObj:actions.payload,
				isValid:true
			}
		case LOGIN_FAILED:
			return {
				...state,
				loginInfoObj:actions.payload,
				isValid:false
			}*/
		default:
			return state
	}
}
