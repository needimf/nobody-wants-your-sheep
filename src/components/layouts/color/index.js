import React, { Component } from 'react';
import { connect } from 'react-redux';

import './index.css';

const mapStateToProps = (state, props) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({
    initializeGame: () => dispatch({ type: 'initializeGame', data: { gameType: "classic" } }),
    selectColor: (number, color, uid) => dispatch({ type: 'addPlayer', data: { number: number, color: color, uuid: uid }}),
    deselectColor: (number, color) => dispatch({ type: 'removePlayer', data: { number: number, color: color }})
  })
}

class ColorLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'undefined',
      selected: false
    }
  }

  render() {
    let showOne = true;
    if(this.props.state.gamePlay.players[1].chosen) {
      showOne = false;
    }
    let showTwo = true;
    if(this.props.state.gamePlay.players[2].chosen) {
      showTwo = false;
    }
    let showThree = true;
    if(this.props.state.gamePlay.players[3].chosen) {
      showThree = false;
    }
    let showFour = true;
    if(this.props.state.gamePlay.players[4].chosen) {
      showFour = false;
    }
    const blue = '#006CAB';
    const orange = '#FF9640';
    const red = '#FF3A33';
    const white = '#FFEED9'
    return (
      <React.Fragment>
      <div className='container-fluid' id='gameSidebar'>
        <div className='playerBar'>
          <h2>Pick a color</h2>
              {this.state.selected ? <div> You are player {this.state.number} <button type='button' onClick={(e) => {e.stopPropagation(); this.props.deselectColor(this.state.color, this.state.number); this.setState({...this.state, selected: false})}}>Deselect Color</button> <button type='button' onClick={(e) => {e.stopPropagation();this.props.start(this.state.number, this.state.color, this.state.color.toLowerCase())}}>Keep Going?</button>s
              </div> : <div> Please choose a color
              <form>
                {this.props.state.gamePlay.players[1].chosen  ? null : <div> <label htmlFor='one'>Player One</label> <input type='checkbox' checked={this.state.number === 1} id='one' onChange={(e)=>e.target.checked ? this.setState({color: e.target.value, number: 1}) : this.setState({color: e.target.value})} value='blue' /> </div>}
                {this.props.state.gamePlay.players[2].chosen  ? null : <div> <label htmlFor='two'>Player Two</label> <input type='checkbox' checked={this.state.number === 2} id='two' onChange={(e)=>e.target.checked ? this.setState({color: e.target.value, number: 2}) : this.setState({color: e.target.value})} value='orange' />  </div> }
                {this.props.state.gamePlay.players[3].chosen  ? null : <div> <label htmlFor='three'>Player Three</label> <input type='checkbox' checked={this.state.number === 3} id='three' onChange={(e)=>e.target.checked ? this.setState({color: e.target.value, number: 3}) : this.setState({color: e.target.value})} value='red' />  </div> }
                {this.props.state.gamePlay.players[4].chosen  ? null : <div> <label htmlFor='four'>Player Four</label> <input type='checkbox' checked={this.state.number === 4} id='four' onChange={(e)=>e.target.checked ? this.setState({color: e.target.value, number: 4}) : this.setState({color: e.target.value})} value='white' /> </div> } 
                <button type='button' onClick={(e) => {e.stopPropagation(); this.props.selectColor(this.state.color, this.props.state.user.metadata.data.uid); this.setState({...this.state, selected: true})}}>Select Color</button>
              </form>
            </div> }
        </div>
      </div>
      </React.Fragment>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorLayout);