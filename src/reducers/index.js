import { combineReducers } from "redux"
import postReducer from "./postReducer"
import screenReducers from "./screenReducers"


export default combineReducers({
	posts: postReducer,
	screenContext:screenReducers
});