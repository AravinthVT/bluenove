import React, {Component} from "react"
import "./NavBar.css"
import SearchBar from "./SearchBar"
import ComponentEvent from "../utils/ComponentEvent"
import {connect } from "react-redux"
import {changeScreen} from "../actions/screenActions"
import {SCREEN_ID_HOME, SCREEN_ID_CREATE_NEW_DISCUSSION, SCREEN_ID_LOGIN} from "../utils/ScreenIDs"

class NavBar extends Component{
	constructor(props){
		super(props);
		this.handleEvent = this.handleEvent.bind(this);
	}

	handleEvent(aEvent){
		switch(aEvent.type){
			case ComponentEvent.SCREEN_CHANGE:
				//console.log("Nav bar SCREEN_CHANGE screenID:"+aEvent.value);
				this.props.changeScreen(aEvent.value,{});
				break;
			default:
				throw Error("NavBar unknown type :"+NavBar);
		}
	}

	render(){
		return (<div className="NavBar">
            <ol>
            <li>logo</li>
            <li className ="navBarMenu" onClick={()=>this.handleEvent({type:ComponentEvent.SCREEN_CHANGE, value:SCREEN_ID_HOME})}><div className="navBarMenu">HOME</div></li>
            <li>|</li>
            <li className ="navBarMenu" onClick={()=>this.handleEvent({type:ComponentEvent.SCREEN_CHANGE, value:SCREEN_ID_CREATE_NEW_DISCUSSION})}><div className="navBarMenu">NEW DISCUSSION</div></li>
            <li>|</li>
            <li><SearchBar/></li>
            <li>|</li>
            <li className ="navBarMenu" onClick={()=>this.handleEvent({type:ComponentEvent.SCREEN_CHANGE, value:SCREEN_ID_LOGIN})}><div className="navBarMenu">LOGIN</div></li>
            </ol>
          </div>)
	}
}

const mapStateToProps = (state) =>{
	console.log("check the state here");
	console.log(state)
		return {
		discussions: state.posts.items,
		screenContext: state.screenContext
	}
}

export default connect(mapStateToProps,{changeScreen})(NavBar)