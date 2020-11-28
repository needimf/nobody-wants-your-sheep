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

class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false
    }
  }
  render() {
    const navs = [
      { name: '0', label: 'Home', link: "" },
    ];
    return (
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
            {this.state.signedIn ? 
              <div className="nav navbar-nav navbar-right ">
                <li>Hello [Name],</li>
                <li><button type="button" onClick={()=>{this.setState({signedIn: false})}}>Logout</button></li>
              </div>
            :
              <div className="nav navbar-nav navbar-right ">
                <li>Hello please</li>
                <li><button type="button" onClick={()=>{this.setState({signedIn: true})}}>Login</button></li>
              </div>
            }
        </div>
      </nav>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);