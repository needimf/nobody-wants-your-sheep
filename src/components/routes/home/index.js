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
    initializeGame: () => dispatch({ type: 'initializeGame' }),
  })
}
    
class Home extends Component {

  componentDidMount() {
    this.props.initializeGame();
  }

  render() {
    console.log(this.props.state);
    return (
      <div className="home-container">
        <img className="logo" src="https://i.imgur.com/qAK9gXT.png" alt="" />
        <div style={{ width: '100%' }}>
          <h1 className="text-white">Under Construction</h1>
          <h2 className="text-white">Check <a href="https://github.com/needimf/nobody-wants-your-sheep">here</a> for updates</h2>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
