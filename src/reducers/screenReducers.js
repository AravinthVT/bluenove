import {SCREEN_ID_HOME, SCREEN_ID_CREATE_NEW_DISCUSSION} from "../utils/ScreenIDs"
import {PANEL_ID_NEW_POST_ENTRY} from "../utils/ScreenIDs"

import {SCREEN_CHANGED, PANEL_NEW_POST_ENTRY_PROP_CHANGE} from "../actions/types"

export const initState = {
	screenID:SCREEN_ID_HOME,
	nextScreenID:null,
	data:null,
	panelNewPostEntryProps:{
		visible:true
	}
}

export default function screenReducer(state=initState, actions){
	console.log("CHK: screenReducer: entry");
	console.log(actions);
	switch(actions.type){
		case SCREEN_CHANGED:
			console.log("CHK: screenReducer: reaches here 22");
			let __nextScreenID = null;
			
			return {
				...state,
				screenID 		:actions.payload.screenID,
				nextScreenID 	:actions.payload.nextScreenID,
				data			:actions.payload.data,
				discussionID	:actions.payload.discussionID
			}
		case PANEL_NEW_POST_ENTRY_PROP_CHANGE:
			return{
				...state,
				panelNewPostEntryProps:{
					...state.panelNewPostEntryProps,
					...actions.payload
				}
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