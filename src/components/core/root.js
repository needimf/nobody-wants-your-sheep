import React from 'react'
import { connect } from 'react-redux'

import routes from '../routes';

const App = ({ page }) => {
  const Component = routes[page];
  return <Component />;
}
 
const mapStateToProps = ({ page }) => ({ page })
 
export default connect(mapStateToProps)(App);

