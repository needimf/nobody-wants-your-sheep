import React, { Component } from 'react';
import {connect} from 'react-redux';
import Link from 'redux-first-router-link';

import GameLayout from '../game/index.js'
import User from '../../../store/user/index.js'

import './index.css';

const mapStateToProps = (state, props) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({
    logoutUser: () => {
      return dispatch(User.logout());
    },
  })
}

class MainLayout extends Component {
  render() {
    console.log(this.props)
    return (
      <React.Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href=""><img id="logoBrand" src="https://i.imgur.com/qAK9gXT.png" alt="" /></a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
                <li className="nav-item" id='links'>
                  <Link className='linkText' to={{ type: 'DEV', payload: { }}}>DEV</Link>
                </li>
                <li className="nav-item" id='links'>
                  <Link className='linkText' to={{type: 'HOME', payload: { }}}>HOME</Link>
                </li>
            </ul>
          </div>
            {this.props.loggedIn ? 
              <div className="nav navbar-nav navbar-right ">
                <li>Hello {this.props.state.user.metadata.data.item['name']},</li>
                <li><button type="button" onClick={() => { this.props.logoutUser() }}>Logout</button></li>
              </div>
            :
              <div className="nav navbar-nav navbar-right ">
                <li>Hello please</li>
                <Link className='loginButton' to={{type: 'LOGIN', payload: { }}}>Login</Link>
              </div>
            }
        </div>
      </nav>
      {this.props.game ? <GameLayout /> : null}
      {this.props.children}
      </React.Fragment>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);