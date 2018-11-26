import React, {Component} from "react"
import "./NavBar.css"
import SearchBar from "./SearchBar"
import ComponentEvent from "../utils/ComponentEvent"

class NavBar extends Component{
	constructor(props){
		super(props);
		this.handleEvent = this.handleEvent.bind(this);
	}

	handleEvent(aEvent){
		switch(aEvent.event){
			case ComponentEvent.SCREEN_CHANGE:
				this.props.handleEvent(aEvent)
				break;
			default:
				throw Error("NavBar unknown event :"+NavBar);
		}
	}

	render(){
		return (<div className="NavBar">
            <ol>
            <li>logo</li>
            <li onClick={()=>this.handleEvent({event:ComponentEvent.SCREEN_CHANGE, value:"main"})}>main</li>
            <li onClick={()=>this.handleEvent({event:ComponentEvent.SCREEN_CHANGE, value:"DiscussionPage"})}>discussion</li>
            <li onClick={()=>this.handleEvent({event:ComponentEvent.SCREEN_CHANGE, value:"DiscussionCreatorPage"})}>discussion</li>
            <li><SearchBar/></li>
            <li>login signup</li>
            </ol>
          </div>)
	}
}

export default NavBar