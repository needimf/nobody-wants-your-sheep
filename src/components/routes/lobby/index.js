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
        <h1>Hello, {this.props.state.user.metadata.data.name}</h1>
        <div style={{ width: '22%', textAlign: 'right' }}>
          <ul>
            <li>You have <span className='badge badge-info'>X</span> Wins</li>
            <li>You have played <span className='badge badge-info'>X</span> games</li>
            <li>Your win percentage is <span className='badge badge-info'>X/X%</span></li>
            <li>Number of ...<ul>
              <li>Resources Collected: <span className='badge badge-info'>X</span></li>
              <li>Robbers Rolled: <span className='badge badge-info'>X</span></li>
              <li>Times Robbed From: <span className='badge badge-info'>X</span></li>
              <li>Built Settements: <span className='badge badge-info'>X</span></li>
              <li>Built Roads: <span className='badge badge-info'>X</span></li>
              <li>Built Cities: <span className='badge badge-info'>X</span></li>
              <li>Built Development Cards: <span className='badge badge-info'>X</span></li>
              <li>Used Development Cards: <span className='badge badge-info'>X</span></li>
              <li>Longest Roads: <span className='badge badge-info'>X</span></li>
              <li>Largest Armies: <span className='badge badge-info'>X</span></li>

            </ul></li>
          </ul>
        </div>
        <div>
          <h2>Here are all your games!</h2>
          <ul>
            <li>1</li>
            <li>2</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
