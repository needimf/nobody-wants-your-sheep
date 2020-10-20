import { NOT_FOUND } from 'redux-first-router';

const components = {
  HOME: 'home',
  DEV: 'dev',
  GAME: 'game',
  [NOT_FOUND]: 'notFound',
};

export default (state = 'home', action = {}) => components[action.type] || state;
