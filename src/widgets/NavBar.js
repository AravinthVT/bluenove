import React, {Component} from "react"
import "./NavBar.css"
import SearchBar from "./SearchBar"
import ComponentEvent from "../utils/ComponentEvent"
import {connect } from "react-redux"
import {changeScreen} from "../actions/screenActions"
import {logout} from "../actions/loginActions"
import {SCREEN_ID_HOME, SCREEN_ID_CREATE_NEW_DISCUSSION, SCREEN_ID_LOGIN, SCREEN_ID_STAT} from "../utils/ScreenIDs"

class NavBar extends Component{
	constructor(props){
		super(props);
		this.handleEvent = this.handleEvent.bind(this);
		this.getLoginText = this.getLoginText.bind(this);
	}

	handleEvent(aEvent){
		switch(aEvent.type){
			case ComponentEvent.SCREEN_CHANGE:
				this.props.changeScreen(aEvent.value,{loginInfoObj:this.props.loginInfoObj});
				break;
			case "logout":
				this.props.logout();
				this.props.changeScreen(SCREEN_ID_HOME,{loginInfoObj:this.props.loginInfoObj});
				break;
			default:
				throw Error("NavBar unknown type :"+NavBar);
		}
	}

	getLoginText(){
		if(this.props.loginStatus=="success"){
			return <li className ="navBarMenu" onClick={()=>this.handleEvent({type:"logout", value:null})}><div className="navBarMenu">LOGOUT : {this.props.loginInfoObj.userName}</div></li>
		}
		return <li className ="navBarMenu" onClick={()=>this.handleEvent({type:ComponentEvent.SCREEN_CHANGE, value:SCREEN_ID_LOGIN})}><div className="navBarMenu">LOGIN</div></li>	
	}

	render(){
		//<li className ="navBarMenu" onClick={()=>this.handleEvent({type:ComponentEvent.SCREEN_CHANGE, value:SCREEN_ID_LOGIN})}><div className="navBarMenu">LOGIN</div></li>

		return (<div className="NavBar">
            <ol>
            <li>logo</li>
            <li className ="navBarMenu" onClick={()=>this.handleEvent({type:ComponentEvent.SCREEN_CHANGE, value:SCREEN_ID_HOME})}><div className="navBarMenu">HOME</div></li>
            <li>|</li>
            <li className ="navBarMenu" onClick={()=>this.handleEvent({type:ComponentEvent.SCREEN_CHANGE, value:SCREEN_ID_CREATE_NEW_DISCUSSION})}><div className="navBarMenu">NEW DISCUSSION</div></li>
            <li>|</li>
            <li className ="navBarMenu" onClick={()=>this.handleEvent({type:ComponentEvent.SCREEN_CHANGE, value:SCREEN_ID_STAT})}><div className="navBarMenu">STATS</div></li>
            <li>|</li>
            <li><SearchBar/></li>
            <li>|</li>
            {this.getLoginText()}
            </ol>
          </div>)
	}
}

const mapStateToProps = (state) =>{
	console.log("check the state here");
	console.log(state)
		return {
		discussions: state.posts.items,
		screenContext: state.screenContext,
		loginInfoObj:state.loginContext.loginInfoObj,
		loginStatus:state.loginContext.loginStatus
	}
}

export default connect(mapStateToProps,{changeScreen, logout})(NavBar)