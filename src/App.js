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
import bgImage from "./images/backgroundPattern2.jpg"
import {Provider} from "react-redux"
import { connect } from 'react-redux'
import PageLoader from "./widgets/PageLoader"


import store from "./store/store"

class App extends Component {
  constructor(props){
    super(props);
    this.state={currentScreen:"main",mainModel:new MainModel()}
    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidMount(){
    console.log("this.state.mainModel"+this.state.mainModel);
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

 /* getCurPage(){
    switch(this.state.currentScreen){
      case "main":
        return (<MainPage mainModel={this.state.mainModel} handleEvent={this.handleEvent}/>)
      case "DiscussionPage":
        return (<DiscussionPage mainModel={this.state.mainModel} handleEvent={this.handleEvent}/>)
      case "DiscussionCreatorPage":
        return (<DiscussionCreatorPage mainModel={this.state.mainModel} handleEvent={this.handleEvent}/>)
      default:
        throw Error("unknow screen name "+this.state.currentScreen);
    }
  }*/

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
    //{this.getCurPage()}
    console.log("APP screen id ::"+this.props.currentScreenID);
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header" style={{backgroundImage: `url(${bgImage})` ,backgroundRepeat: "repeat"}}>
            <NavBar handleEvent={this.handleEvent}/>
            <PageLoader/>
            
          </header>
        </div>
      </Provider>
    );
  }
}

const mapStateToProps = state =>({
    currentScreenID: state.screenIDs.screenID
})

export default App;
//export default connect(mapStateToProps, {})(App)
