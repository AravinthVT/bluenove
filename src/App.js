import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './widgets/NavBar'
import DiscussionWidget from './widgets/DiscussionWidget'
import MainPage from "./pages/MainPage"
import DiscussionPage from "./pages/DiscussionPage"
import DiscussionCreatorPage from "./pages/DiscussionCreatorPage"
import ComponentEvent from "./utils/ComponentEvent"
import MainModel from "./models/MainModel"
import ModelEvents from "./models/ModelEvents"

class App extends Component {
  constructor(props){
    super(props);
    this.state={currentScreen:"main",mainModel:new MainModel()}
    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidMount(){
    var discussion = {
        about:"music",
        createdDate:"date date",
        title:"Does anyone think that the sequels sort of have the opposite problems ...",
        description:"In my opinion, the best part of the prequel trilogy was its overall pl...",
        creatorId:"5bff009f1c9d440000c0732a",
        visibility:"public"
    }
    this.state.mainModel.handleEvent({event:ModelEvents.CREATE_NEW_DISCUSSION, value:discussion})
  }

  getCurPage(){
    switch(this.state.currentScreen){
      case "main":
        return (<MainPage handleEvent={this.handleEvent}/>)
      case "DiscussionPage":
        return (<DiscussionPage handleEvent={this.handleEvent}/>)
      case "DiscussionCreatorPage":
        return (<DiscussionCreatorPage/>)
      default:
        throw Error("unknow screen name "+this.state.currentScreen);
    }
  }

  handleEvent(aEvent){
    switch(aEvent.event){
      case ComponentEvent.SCREEN_CHANGE:
        this.setState({currentScreen:aEvent.value})
        break;
      default:
        throw Error("App unknown event::"+aEvent)
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <NavBar handleEvent={this.handleEvent}/>
          {this.getCurPage()}
        </header>
      </div>
    );
  }
}

export default App;
