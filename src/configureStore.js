import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { connectRoutes } from 'redux-first-router';
import reduxThunk from 'redux-thunk';
import reducers from './store';
import appConfig from './config.json';

const routesMap = appConfig.router;

export default function configureStore(preloadedState) {
  const { reducer, middleware, enhancer } = connectRoutes(routesMap);

  const rootReducer = combineReducers({ ...reducers, location: reducer });
  const middlewares = applyMiddleware(middleware, reduxThunk);
  const enhancers = compose(enhancer, middlewares);

  const store = createStore(rootReducer, preloadedState, enhancers);

  return store;
}
