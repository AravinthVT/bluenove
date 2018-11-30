import {FETCH_POSTS, NEW_POSTS} from "../actions/types"

const initialState = {
	items:[],
	item:{}
}

export default function(state=initialState, actions){
	console.log("CHK: postReducer: reaches here 11");
	switch(actions.type){
		case FETCH_POSTS:
			console.log("CHK: postReducer: reaches here 22");
			return {
				...state,
				items:actions.payload
			}
		default:
			return state
	}
}
