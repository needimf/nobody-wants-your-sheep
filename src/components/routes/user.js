import React, {Component} from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state, props) => {
  return {
    userId: state.location.payload.id
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({})
}
    
class User extends Component {

  render() {
    return (
      <h3>{`User ${this.props.userId}`}</h3>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
