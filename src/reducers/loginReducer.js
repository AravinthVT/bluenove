import {LOGIN_SUCCESS, LOGIN_FAILED, IS_SIGNED_USER} from "../actions/types"
import {SCREEN_ID_HOME} from "../utils/ScreenIDs"

const initialState = {
	loginInfoObj:null,
	nextScreenInfoObj:{screenID:SCREEN_ID_HOME,data:null},
	userType:"guest",
	loginStatus:"init"
}

export default function(state=initialState, actions){
	console.log("CHK: loginReducer: entry");
	switch(actions.type){
			
		case LOGIN_SUCCESS:
			console.log(actions);
			return {
				...state,
				loginInfoObj:actions.payload,
				userType:"signed_user",
				loginStatus:"success"
			}
		case LOGIN_FAILED:
			console.log(actions);
			return {
				...state,
				loginInfoObj:actions.payload,
				userType:"guest",
				loginStatus:"failed"
			}
		case IS_SIGNED_USER:
		default:
			return state
	}
}
