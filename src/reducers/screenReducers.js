import {SCREEN_ID_HOME, SCREEN_ID_CREATE_NEW_DISCUSSION} from "../utils/ScreenIDs"
import {SCREEN_CHANGED} from "../actions/types"

export const initState = {
	screenID:SCREEN_ID_HOME,
	nextScreenID:null,
	data:null
}

export default function screenReducer(state=initState, actions){
	console.log("CHK: screenReducer: entry");
	console.log(actions);
	switch(actions.type){
		case SCREEN_CHANGED:
			console.log("CHK: screenReducer: reaches here 22");
			let __nextScreenID = null;
			
			return {
				screenID 		:actions.payload.screenID,
				nextScreenID 	:actions.payload.nextScreenID,
				data			:actions.payload.data,
				discussionID	:actions.payload.discussionID
			}
		default:
			return state
	}
}

function getNextScreenID(actions){
	let __nextScreenID = null;
	if(actions.payload && actions.payload.data){
		__nextScreenID = actions.payload.data.nextScreenID
	}
	return __nextScreenID;
}