import React, { Component } from 'react'
import { connect } from 'react-redux'

import routes from '../routes';

const mapStateToProps = (state, props) => {
  return {
    route: state.page,
  };
};

class Root extends Component {
  constructor(props) {
    super (props);
    this.state = { loggedIn: false };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.setState({ loggedIn: true });
      } else {
        // No user is signed in.
        this.setState({ loggedIn: false });
      }
    });
  }

  render() {
    if (!this.state.loggedIn && this.props.route !== 'home' && this.props.route !== 'login' && this.props.route !== 'notFound') return <routes.login />;
    const Component = routes[this.props.route];
    return <Component />;
  }
}
 
export default connect(mapStateToProps)(Root);

