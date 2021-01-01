import React, {Component} from 'react';
import {connect} from 'react-redux';

import './index.css';

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => {
  return ({})
}
    
class Login extends Component {

  componentDidMount() {
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    const config = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        // uiShown: function() {
        //   // The widget is rendered.
        //   // Hide the loader.
        //   document.getElementById('loader').style.display = 'none';
        // }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: '/',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      // Terms of service url.
      // tosUrl: '<your-tos-url>',
      // Privacy policy url.
      // privacyPolicyUrl: '<your-privacy-policy-url>'
    };
    ui.start('#login-container', config);
  }

  render() {
    return (
      <div id="login-container" className="login-container"></div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
