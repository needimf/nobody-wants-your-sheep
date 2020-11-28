import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sync, clear } from '../../store/user';

import routes from '../routes';

const mapStateToProps = (state, props) => {
  return {
    route: state.page,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({
    syncUser: () => {
      return dispatch(sync());
    },
    clearUser: () => {
      return dispatch(clear());
    },
  })
}

class Root extends Component {
  constructor(props) {
    super (props);
    this.state = {
      loggedIn: false,
      fetchedLoginStatus: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.props.syncUser();
        this.setState({ loggedIn: true, fetchedLoginStatus: true });
      } else {
        // No user is signed in.
        this.props.clearUser();
        this.setState({ loggedIn: false, fetchedLoginStatus: true });
      }
    });
  }

  render() {
    if (this.props.route !== 'home' && this.props.route !== 'login' && this.props.route !== 'notFound') {
      if (!this.state.fetchedLoginStatus) return <div style={{color: "white"}}>Loading</div>;
      if (!this.state.loggedIn) return <routes.login />;
    }
    const Component = routes[this.props.route];
    return <Component />;
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(Root);

