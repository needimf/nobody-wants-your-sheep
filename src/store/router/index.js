import { NOT_FOUND } from 'redux-first-router';

const components = {
  HOME: 'home',
  DEV: 'dev',
  GAME: 'game',
  LOGIN: 'login',
  [NOT_FOUND]: 'notFound',
  LOGIN: 'login',
  LOBBY: 'lobby'
};

export default (state = 'home', action = {}) => components[action.type] || state;
