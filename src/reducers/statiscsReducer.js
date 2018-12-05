import {QUERY_LIFECYCLE_IDLE, QUERY_LIFECYCLE_SENT, QUERY_LIFECYCLE_SUCCESS, QUERY_LIFECYCLE_FAILED} from "../utils/QueryLifeCycle"
import {FETCH_STAT} from "../actions/types"

const initialState = {
	totalDiscussions:0,
	totalPosts:0,
	totalUsers:0,
	queryLifeCycleStatus:QUERY_LIFECYCLE_IDLE
}

export default function(state=initialState, actions){
	console.log("CHK: postReducer: entry");
	switch(actions.type){
		case FETCH_STAT:
			console.log("CHK: postReducer: reaches here FETCH_STAT");
			return {
				...state,
				...actions.payload
			}
		default:
			return state
	}
}