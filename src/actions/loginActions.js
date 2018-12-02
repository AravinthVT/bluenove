import {LOGIN_SUCCESS, LOGIN_FAILED, IS_SIGNED_USER} from "./types"

export function login(aUserName, aPassword){
	console.log(`aUserName:${aUserName}`);
	console.log(`aPassword:${aPassword}`);
	
	return function(dispatch){
	
		//const aUrl ="http://localhost:3001/discussions"
		const aUrl =`http://localhost:3001/login/userName/${aUserName}/password/${aPassword}/`
		console.log(`aUrl:${aUrl}`);
		fetch(aUrl).then((response)=>{
			console.log("login Successfully response");
			console.log(response);
			if(response.status== "200"){
				console.log("login Successfully update the discussions");
			}else{
				console.log("TODO handle status issue:"+response.status);
			}
			return response.json();
		}).then((data)=>{
			console.log("CHK: login: Successfully update the discussions data");
			console.log(data);
			if(data.login_status=="valid"){
				dispatch({type:LOGIN_SUCCESS, payload:data});
			}else if(data.login_status=="invalid"){
				dispatch({type:LOGIN_FAILED, payload:null});
			}
			return data;
		}).catch((err)=>{
			console.log("CHK: login: Could load discussion"+err);
			dispatch({type:LOGIN_FAILED, payload:null});
			throw err
		})
	}
}

export function isSignedUser(aUserName, aPassword){
	return function(dispatch){
	
		//const aUrl ="http://localhost:3001/discussions"
		const aUrl =`http://localhost:3001/login/userName/${aUserName}/password/${aPassword}/`
		console.log(`aUrl:${aUrl}`);
		dispatch({type:IS_SIGNED_USER});
	}
}
