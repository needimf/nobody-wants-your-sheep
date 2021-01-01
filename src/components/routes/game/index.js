import React, {Component} from 'react';
import {connect} from 'react-redux';
import GameView from '../../containers/gameView'

import './index.css';

const mapStateToProps = (state, props) => {
  return {
    gameState: state.gamePlay,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({
  })
}
    
class Game extends Component {
  render() {
    return (
      <div className="home-container">
        <div style={{ width: '100%' }}>
          <GameView />
          <h1 className="text-white">Welcome to your new game</h1>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
