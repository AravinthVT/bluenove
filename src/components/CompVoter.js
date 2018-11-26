import React, { Component } from 'react';
import "./CompVoter.css"
import NumUtils from "../utils/NumUtils"
import ComponentEvent from "../utils/ComponentEvent"

export class CompVoter extends Component {
	constructor(props){
		super(props);
		
		props={
			voteUp:null,
			voteDown:null
		}

		this.state={value:0}

		this.voteUp = this.voteUp.bind(this)
		this.voteDown = this.voteDown.bind(this)
	}

	voteUp(){
		console.log("CHK: this.props.voteUp:"+this.props.voteUp);
		this.setState({value:this.state.value+1});
		if(this.props.handleEvent)
			this.props.handleEvent({event:ComponentEvent.VOTE_UP, value:null});
	}

	voteDown(){
		console.log("CHK: this.props.voteDown:"+this.props.voteDown);
		this.setState({value:this.state.value-1});
		if(this.props.handleEvent)
			this.props.handleEvent({event:ComponentEvent.VOTE_UP, value:null});
	}

	render() {
		return (
			<div className="CompVoter">
				<ol >
					<li className="compVoter_btn" onClick={this.voteUp}>+</li>
					<li className="compVoter_value">{NumUtils.getPrettyVoteValue(this.state.value)}</li>
					<li className="compVoter_btn" onClick = {this.voteDown}>-</li>
				</ol>
			</div>
		);
	}
}

export default CompVoter