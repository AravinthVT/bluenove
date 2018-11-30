import React, { Component } from 'react';
import { connect } from "react-redux";
import "./LoginWidget.css"
import CompButton from "../components/CompButton"
import ComponentEvent from "../utils/ComponentEvent"
import {login} from "../actions/postActions"

export class LoginWidget extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			userName:"",
			password:"",
			errorMessage:" "
		}
		this.userNameChange=this.userNameChange.bind(this)
		this.passwordChange=this.passwordChange.bind(this)
		this.doLogin=this.doLogin.bind(this)
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
				this.doLogin()
			break;
			default:
				throw new Error("unknow component event:"+aEvent);
		}
	}

	doLogin(){
		console.log("this.state.userName:"+this.state.userName)
		console.log("this.state.password:"+this.state.password)
		try{
			if(this.state.userName.trim()=="") throw new Error("empty_username");
			if(this.state.password.trim()=="") throw new Error("empty_password");
			login(this.state.userName.trim(), this.state.password.trim());
			this.setState({errorMessage:" "})
		}catch(err){
			switch(err.message){
				case "empty_username":
					this.setState({errorMessage:"Please enter a user name"})
					break;
				case "empty_password":
					this.setState({errorMessage:"Please enter a password"})
					break;
				default:
					throw err;
			}
		}
	}

	isEntryValid(){
		return true;
	}

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

	render() {
		return (
			<div className="LoginWidget">
				<ol>
					<li className="loginWidgetLabelContainer">
						<label className="loginWidgetLabel" style={{width:"150px"}}>User Name</label><input className="loginWidgetInput" placeHolder="User Name" onChange={this.userNameChange}/>
					</li>
					<li className="loginWidgetLabelContainer">
						<label className="loginWidgetLabel" style={{width:"150px"}}>Password</label><input className="loginWidgetInput" type="password" placeHolder="Password" onChange={this.passwordChange}/>
					</li>
					{this.getErrorMessage()}
					<li className="loginWidgetButtonContainer">
						<CompButton value="Let me in" handleEvent={()=>{this.handleEvent({type:ComponentEvent.CLICK, value:null})}}/>
					</li>
					
				</ol>
			</div>
		);
	}
}

const mapStateToProps = (state) =>{
	console.log("LoginWidget check the state here");
	console.log(state)
	return {
		currentScreenID: state.screenContext.screenID
	}
}

export default connect(mapStateToProps,{})(LoginWidget)
