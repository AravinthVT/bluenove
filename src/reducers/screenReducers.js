import {SCREEN_ID_HOME, SCREEN_ID_CREATE_NEW_DISCUSSION} from "../utils/ScreenIDs"
import {SCREEN_CHANGED} from "../actions/types"

export const initState = {
	screenID:SCREEN_ID_HOME,
	data:null
}

export default function screenReducer(state=initState, actions){
	console.log("CHK: screenReducer: entry");
	console.log(actions);
	switch(actions.type){
		case SCREEN_CHANGED:
			console.log("CHK: screenReducer: reaches here 22");
			return {
				screenID:actions.payload.screenID,
				data:actions.payload.data
				//...screenID:actions.payload,
			}
		default:
			return state
	}
}