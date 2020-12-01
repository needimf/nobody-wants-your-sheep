import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    return (
      <div className='container-fluid' id='gameSidebar'>
          <div className='playerBar'>
            <h3 style={{color: this.props.color}}>{this.props.color} Player</h3>
            <div>
              <span className='titles' style={{color: this.props.color}}>Resources</span> <br></br>
              Wood: {this.props.state.gamePlay.players[1].resources['wood']} <br></br>
              Brick: {this.props.state.gamePlay.players[1].resources['brick']} <br></br>
              Ore: {this.props.state.gamePlay.players[1].resources['ore']}  <br></br>
              Wheat: {this.props.state.gamePlay.players[1].resources['wheat']}  <br></br>
              Sheep: {this.props.state.gamePlay.players[1].resources['sheep']}
            </div>
            <div>
              <span className='titles' style={{color: this.props.color}}>Development Cards</span> <br></br>
              Knight: {this.props.state.gamePlay.players[1].devCards['knight']} <br></br>
              Used Knights: {this.props.state.gamePlay.players[1].devCards['usedKnights']} <br></br>
              Monopoly: {this.props.state.gamePlay.players[1].devCards['monopoly']} <br></br>
              RoadBuilder: {this.props.state.gamePlay.players[1].devCards['roadBuilder']} <br></br>
              Victory Point: {this.props.state.gamePlay.players[1].devCards['victoryPoint']} <br></br>
              Year of Plenty: {this.props.state.gamePlay.players[1].devCards['yearOfPlenty']} <br></br>
            </div>
            <div>
              <span className='titles' style={{color: this.props.color}}>Structures</span> <br></br>
              Settlement: {this.props.state.gamePlay.players[1].available['settlement']} <br></br>
              City: {this.props.state.gamePlay.players[1].available['city']} <br></br>
              Road: {this.props.state.gamePlay.players[1].available['road']} <br></br>
            </div>
          </div>
          <div className='actionBar'>
            <h3>Resources Required</h3>
            <div className='infoCard'>
              Settlement : 1 Brick, 1 Sheep, 1 Wheat, 1 Wood <br></br>
              City  : 3 Ore, 2 Wheat <br></br>
              Road  : 1 Brick, 1 Wood <br></br>
              Development Card  : 1 Ore, 1 Sheep, 1 Wheat <br></br>
            </div>
            <button className='settlementBtn' type='button' onClick={()=> console.log('buildSettlement')}>Build a Settlement</button>
            <button className='cityBtn' type='button' onClick={()=> console.log('buildCity')}>Build a City</button>
            <button className='roadBtn' type='button' onClick={()=> console.log('buildRoad')}>Build a Road</button>
            <button className='devCardBuyBtn' type='button' onClick={()=> console.log('devCardBuy')}>Build a Development Card</button>
            <button className='devCardUseBtn' type='button' onClick={()=> console.log('devCardUse')}>Use a Development Card</button>
            <button className='tradeBtn' type='button' onClick={()=> console.log('tradePlayer')}>Make a Trade</button>
            <button className='resourceBtn' type='button' onClick={()=> console.log('tradeResources')}>Trade in Resources</button>
          </div>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameLayout);