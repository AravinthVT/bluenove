import {SCREEN_CHANGED} from "./types"
import {SCREEN_ID_HOME, SCREEN_ID_CREATE_NEW_DISCUSSION} from "../utils/ScreenIDs"

export function changeScreen(aScreenId, config={data:null}){
	return function(dispatch){
		console.log("CHK: changeScreen Screen change method called");
		dispatch({type:SCREEN_CHANGED, payload:{screenID:aScreenId, data:config}});
	}
}