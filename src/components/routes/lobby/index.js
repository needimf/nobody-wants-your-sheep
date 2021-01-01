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
    
class Lobby extends Component {
  render() {
    return (
      <div className="home-container">
        <h3>Placeholder for player information</h3>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
