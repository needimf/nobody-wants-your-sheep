import React, {Component} from 'react';
import {connect} from 'react-redux';
import Link from 'redux-first-router-link';
import User from '../../../store/user';

import './index.css';

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => {
  return ({
    logoutUser: () => {
      return dispatch(User.logout());
    },
  })
}
    
class Dev extends Component {

  render() {
    return (
      <div className="home-container">
        <img className="logo" src="https://i.imgur.com/qAK9gXT.png" alt="" />
        <div style={{ width: '100%' }}>
          <h1 className="text-white">Start New Game</h1>
          <Link to={{ type: 'GAME', payload: { gameId: '1' }}}>Start New</Link>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dev);
