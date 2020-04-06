import React, {Component} from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => {
  return ({})
}
    
class NotFound extends Component {

  render() {
    return (
      <h3>404</h3>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
