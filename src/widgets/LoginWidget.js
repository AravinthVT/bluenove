import React, { Component } from 'react';
import { connect } from "react-redux";
import "./LoginWidget.css"
import CompButton from "../components/CompButton"
import ComponentEvent from "../utils/ComponentEvent"
import {login} from "../actions/loginActions"
import { changeScreen } from "../actions/screenActions"

export class LoginWidget extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			userName:"",
			password:"",
			errorMessage:" ",
			enabled:true
		}
		this.userNameChange=this.userNameChange.bind(this)
		this.passwordChange=this.passwordChange.bind(this)
		this.doLogin=this.doLogin.bind(this)
		this.navigateToScreen=this.navigateToScreen.bind(this)
		
	}

	getErrorMessage(){
		if(!this.state.errorMessage) return null;
		return (<li className="loginWidgetLabelContainer loginWidgetErrorMsg">
						<div>{this.state.errorMessage}</div>
					</li>)
	}

	handleEvent(aEvent){
		console.log("is coming to handleEvent")
		switch(aEvent.type){
			case ComponentEvent.CLICK:
				this.setState({enabled:false})
				this.doLogin();
				break;
			default:
				throw new Error("unknow component event:"+aEvent);
		}
	}

	doLogin(){
		console.log("this.state.userName:"+this.state.userName);
		console.log("this.state.password:"+this.state.password);
		try{
			this.assertEntry();
			this.props.login(this.state.userName.trim(), this.state.password.trim());
			this.setState({errorMessage:" "});
		}catch(err){
			switch(err.message){
				case "empty_username":
					this.setState({errorMessage:"Please enter a user name", enabled:true})
					break;
				case "empty_password":
					this.setState({errorMessage:"Please enter a password", enabled:true})
					break;
				default:
					throw err;
			}
		}
	}

	navigateToScreen(aScreenID){
		console.log("this.props.loginInfoObj::::::::::::"+this.props.loginInfoObj);
		if(aScreenID){
			this.props.changeScreen(aScreenID,{loginInfoObj:this.props.loginInfoObj});
		}
	}

	shouldComponentUpdate(aNextProp, aNextState){
		console.log("shouldComponentUpdate");
		console.log(aNextProp);
		console.log(aNextProp.loginInfoObj);
		console.log(aNextState)
		let __loginInfoObj = aNextProp.loginInfoObj
		let __loginStatus =aNextProp.loginStatus
		if(__loginInfoObj){
			if(__loginStatus=="success"){
				aNextState.errorMessage='Login successful'
				aNextState.enabled = false;
				setTimeout(()=>this.navigateToScreen(this.props.nextScreenID), 1000);
			}else if(__loginStatus=="failed"){
				aNextState.errorMessage='Login failed. Please try again.'
				aNextState.enabled = true;
			}else{
				//aNextState.errorMessage=' '
			}
		}
		return true;
	}

	assertEntry(){
		if(this.state.userName.trim()=="") throw new Error("empty_username");
		if(this.state.password.trim()=="") throw new Error("empty_password");
		return true;
	}

	//----------------------------------------------------------------------------
	userNameChange(aEvent){
		aEvent.preventDefault();
		this.setState({
			userName:aEvent.target.value
		})
	}

	passwordChange(aEvent){
		aEvent.preventDefault();
		this.setState({
			password:aEvent.target.value
		})
	}
	//----------------------------------------------------------------------------

	render() {
		console.log("nextScreenID nextScreenID :"+this.props.nextScreenID);
		return (
			<div className="LoginWidget">
				<div className="LoginWidgetTitle">LOGIN</div>
				<ol>
					<li className="loginWidgetLabelContainer">
						<label className="loginWidgetLabel" style={{width:"150px"}}>User Name</label><input className="loginWidgetInput" placeHolder="User Name" onChange={this.userNameChange}/>
					</li>
					<li className="loginWidgetLabelContainer">
						<label className="loginWidgetLabel" style={{width:"150px"}}>Password</label><input className="loginWidgetInput" type="password" placeHolder="Password" onChange={this.passwordChange}/>
					</li>
					{this.getErrorMessage()}
					<li className="loginWidgetButtonContainer">
						<CompButton value="Let me in" enabled={this.state.enabled} handleEvent={()=>{this.handleEvent({type:ComponentEvent.CLICK, value:null})}}/>
					</li>
				</ol>
			</div>
		);
	}
}

const mapStateToProps = (state) =>{
	console.log("LoginWidget: mapStateToProps: check the state here");
	console.log(state)
	return {
		currentScreenID: state.screenContext.screenID,
		nextScreenID:state.screenContext.nextScreenID,
		loginInfoObj:state.loginContext.loginInfoObj,
		loginStatus:state.loginContext.loginStatus
	}
}

export default connect(mapStateToProps,{login, changeScreen})(LoginWidget)
