import React, { Component } from 'react';
import LoginWidget from "../widgets/LoginWidget"
import "./LoginPage.css"

export class LoginPage extends Component {
	constructor(props){
		super(props);
		props = {mainModel:null}
	}
	render() {
		return (
			<div className="LoginPage">
				<p>Please enter the login information</p>
				<div>
					<LoginWidget/>
				</div>
			</div>
		);
	}
}
export default LoginPage
