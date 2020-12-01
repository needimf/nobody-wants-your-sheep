import React, {Component} from 'react';
import {connect} from 'react-redux';

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
    
class Dev extends Component {
  render() {
    return (
      <div className="home-container">
        <img className="logo" src="https://i.imgur.com/qAK9gXT.png" alt="" />
        <div style={{ width: '100%' }}>
          <h1 className="text-white">Welcome to your new game</h1>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dev);
