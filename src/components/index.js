import React, {Component} from 'react';
import {connect} from 'react-redux';
import {sync} from '../store/test';

const mapStateToProps = (state, props) => {
  return {
    state,
  };
}

class ListItem extends Component {
  handleComplete = () => {
    const {sync} = this.props;
    sync();
  };
  render() {
    console.log(process.env);
    console.log(this.props);
    return (
      <div key="toDoName">
        <h4>
          <span onClick={() => this.handleComplete()}>
            <i>Done</i>
          </span>
        </h4>
      </div>
    );
  }
}
export default connect(mapStateToProps, {sync})(ListItem);