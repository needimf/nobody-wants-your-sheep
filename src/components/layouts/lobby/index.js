import React, { Component } from 'react';
import { connect } from 'react-redux';

import './index.css'

const mapStateToProps = (state, props) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({
    initializeGame: () => dispatch({ type: 'initializeGame', data: { gameType: "classic" } }),
  })
}

class LobbyLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inGame: false
    }
  }
  render() {
    return (
      <div className='container-fluid' id='gameSidebar'>
        <div className='playerBar'>
          {!this.state.inGame ? <div>
            <h1 className="text-white">Game Lobby</h1>
            <h3>Join Friends</h3>
            <div className='findGame'>
              <input type='text' placeholder={window.location.href + '/###'} style={{ width: '65%' }}></input>
              <button type='button' onClick={() => {console.log('Send user to specified game url'); this.props.initializeGame(); this.setState({inGame: true, currentColor: undefined})}} style={{ backgroundColor: 'white', color: 'black' }}>Search</button>
            </div>
            <h3>Create a Game</h3>
            <div className='createGame'>
              <button type='button' onClick={() => {this.props.initializeGame(); this.setState({inGame: true, currentColor: undefined})}}>Create</button>
            </div>
          </div>
          :
          <div>
          <h2>Pick a color</h2>
            <div>
              Display available colors and allow selection, then dispatch selected player color to render gameLayout in route
              <button type='button' onClick={() => {this.props.select('blue')}}>Pick Blue</button>
            </div>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyLayout);