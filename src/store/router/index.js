import { NOT_FOUND } from 'redux-first-router';

const components = {
  HOME: 'home',
  USER: 'user',
  [NOT_FOUND]: 'notFound',
};

export default (state = 'home', action = {}) => components[action.type] || state;
