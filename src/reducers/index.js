import { combineReducers } from "redux"
import postReducer from "./postReducer"
import screenReducers from "./screenReducers"
import loginReducer from "./loginReducer"

export default combineReducers({
	posts			: postReducer,
	screenContext	: screenReducers,
	loginContext	: loginReducer,
	discussionCreatorContext: postReducer,
	discussionExpandedContext:postReducer,
	postModel		: postReducer
});