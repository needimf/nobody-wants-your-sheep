import React, { Component } from 'react';
import {connect} from 'react-redux';
import Link from 'redux-first-router-link';

import './index.css';

const mapStateToProps = (state, props) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({
  })
}

class GameLayout extends Component {
  render() {
    console.log(this.props)
    return (
      <div className='container-fluid' id='gameSidebar'>
        <h1 className="text-white">Hello Player</h1>
        {this.props.state.gamePlay.players ? 
        <div className='playerBar'>
            <div>
              <em>Resources</em> <br></br>
              Wood: {this.props.state.gamePlay.players[1].resources['wood']} <br></br>
              Brick: {this.props.state.gamePlay.players[1].resources['brick']} <br></br>
              Ore: {this.props.state.gamePlay.players[1].resources['ore']}  <br></br>
              Wheat: {this.props.state.gamePlay.players[1].resources['wheat']}  <br></br>
              Sheep: {this.props.state.gamePlay.players[1].resources['sheep']} 
            </div>
            <div>
              <em>Development Cards</em> <br></br>
              Knight: {this.props.state.gamePlay.players[1].devCards['knight']} <br></br>
              Used Knights: {this.props.state.gamePlay.players[1].devCards['usedKnights']} <br></br>
              Monopoly: {this.props.state.gamePlay.players[1].devCards['monopoly']} <br></br>
              RoadBuilder: {this.props.state.gamePlay.players[1].devCards['roadBuilder']} <br></br>
              Victory Point: {this.props.state.gamePlay.players[1].devCards['victoryPoint']} <br></br>
              Year of Plenty: {this.props.state.gamePlay.players[1].devCards['yearOfPlenty']} <br></br>
            </div>
          <div>
              <em>Structures</em> <br></br>
              Settlement: {this.props.state.gamePlay.players[1].available['settlement']} <br></br>
              City: {this.props.state.gamePlay.players[1].available['city']} <br></br>
              Road: {this.props.state.gamePlay.players[1].available['road']} <br></br>
            </div>
          </div>
          :
          <div style={{ width: '100%' }}>
              <h1 className="text-white">Loading</h1>
          </div>
        }
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameLayout);