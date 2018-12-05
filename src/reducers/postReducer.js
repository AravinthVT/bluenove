import {FETCH_POSTS, NEW_DISCUSSION, NEW_POSTS, INSERT_POST, LOGIN_SUCCESS, LOGIN_FAILED, EXPAND_DISCUSSION, DELETE_DISCUSSION} from "../actions/types"
import {QUERY_LIFECYCLE_IDLE, QUERY_LIFECYCLE_SENT, QUERY_LIFECYCLE_SUCCESS, QUERY_LIFECYCLE_FAILED} from "../utils/QueryLifeCycle"

const initialState = {
	items:[],
	item:{},
	currentDiscussion:null,
	expandDiscussionStatus:QUERY_LIFECYCLE_IDLE,
	insertPostStatus:QUERY_LIFECYCLE_IDLE,
	insertPostStatusMessage:"",
	deleteDiscussionStatus:QUERY_LIFECYCLE_IDLE,
	deleteDiscussionMessage:"",
}

export default function(state=initialState, actions){
	console.log("CHK: postReducer: entry");
	switch(actions.type){
		case FETCH_POSTS:
			console.log("CHK: postReducer: reaches here FETCH_POSTS");
			return {
				...state,
				items	:actions.payload
			}
		case NEW_DISCUSSION:
			console.log("CHK: postReducer: reaches here NEW_DISCUSSION");
			return {
				...state,
				status	:actions.payload.status,
				data	:actions.payload.data
			}
		case EXPAND_DISCUSSION:
			
			console.log("CHK: postReducer: reaches here EXPAND_DISCUSSION");
			return {
				...state,
				/*status	:actions.payload.status,*/
				expandDiscussionStatus: actions.payload.status,
				data	:actions.payload.data,
				currentDiscussion:actions.payload.currentDiscussion,
				allChildPosts:actions.payload.allChildPosts
			}
		case INSERT_POST:
			console.log("CHK: postReducer: reaches here INSERT_POST");
			return {
				...state,
				insertPostStatus		:actions.payload.insertStatus,
				insertPostStatusMessage :actions.payload.insertPostStatusMessage
			}
		case DELETE_DISCUSSION:
			console.log("CHK: postReducer: reaches here DELETE_DISCUSSION");
			return {
				...state,
				deleteDiscussionStatus		:actions.payload.deleteDiscussionStatus,
				deleteDiscussionMessage 	:actions.payload.deleteDiscussionMessage
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
