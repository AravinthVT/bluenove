import {SCREEN_CHANGED} from "./types"
import {SCREEN_ID_HOME, SCREEN_ID_CREATE_NEW_DISCUSSION, SCREEN_ID_LOGIN} from "../utils/ScreenIDs"

export function changeScreen(aScreenId, config={}){
	console.log("CHK: changeScreen: entry aScreenId:"+aScreenId);
	console.log(config);
	const screenNeededAuth=[SCREEN_ID_CREATE_NEW_DISCUSSION];
	const __payload={
		...config,
		screenID:aScreenId
	}

	if(screenNeededAuth.indexOf(aScreenId)>=0){
		console.log(config.loginInfoObj);
		//assert
		//if(!config.loginInfoObj) throw new Error("needs loginInfoObj");
		console.log("CHK: changeScreen: into the authentication channel");

		if(config.loginInfoObj && config.loginInfoObj.login_status=="valid"){
			console.log("proceeding to the create new discussions page");
		}else{
			console.log("redirecting to proceeding to login page");
			alert("Please login to create a new Discussion");
			__payload.screenID 		= SCREEN_ID_LOGIN;
			__payload.nextScreenID	= aScreenId;
		}
	}
	
	return function(dispatch){
		console.log("CHK: changeScreen Screen change method called");
		dispatch({type:SCREEN_CHANGED, payload:__payload});
	}
}