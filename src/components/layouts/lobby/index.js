import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'redux-first-router-link';


import './index.css'

const mapStateToProps = (state, props) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({
    initializeGame: () => dispatch({ type: 'initializeGame', data: { gameType: "classic" } }),
    chooseColor: (color) => dispatch({ type: 'addPlayer', data: { color: color}})
  })
}

class LobbyLayout extends Component {
  render() {
    return (
      <div className='container-fluid' id='gameSidebar'>
        <div className='playerBar'>
          <div>
            <h1 className="text-white">Game Lobby</h1>
            <h3>Join Friends</h3>
            <div className='findGame'>
              <input type='text' placeholder={window.location.href + '/###'} style={{ width: '65%' }}></input>
              <button type='button' onClick={() => {console.log('Send user to specified game url');}} style={{ backgroundColor: 'white', color: 'black' }}>Search</button>
            </div>
            <h3>Create a Game</h3>
            <Link to={{ type: 'GAME', payload: { gameId: '1' }}} onClick={this.props.initializeGame}>Create New Game</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyLayout);