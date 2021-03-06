import { combineReducers } from 'redux';
import { getStatusActionTypes, getStatusReducers } from '../_utilities/statusReducer';

import metadata from './metadata';

const name = 'USER';
const actionTypes = getStatusActionTypes(name);

const initialState = {
  paths: {},
  item: {},
};

export const _reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.clear:
      return { ...initialState };

    case actionTypes.fetchSuccess:
      return {
        ...state,
        item: { ...action.data },
        // items: { ...action.items, ...action.data },
        paths: { ...state.paths, ...action.paths },
      };

    default:
      return state;
  }
};

export const reducer = combineReducers({
  status: getStatusReducers(name),
  data: _reducer,
  metadata: metadata.reducer,
});

export function sync() {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    const path = `users/${userId}`;
    firebase.database().ref(path).on('value', (snapshot) => {
      dispatch({ type: actionTypes.fetchSuccess, data: snapshot.val(), paths: { [path]: true } });
    });
  };
}

export function clear() {
  return async (dispatch, getState) => {
    console.log(getState());
    const { paths } = getState().user.data;
    Object.keys(paths).forEach((path) => {
      firebase.database().ref(path).off();
    });
    dispatch({ type: actionTypes.clear });
  };
}

export function logout() {
  return async (dispatch, getState) => firebase.auth().signOut();
}

export function syncMetadata() {
  return async (dispatch, getState) => metadata.sync()(dispatch, getState);
}

export function clearMetadata() {
  return async (dispatch, getState) => metadata.clear()(dispatch, getState);
}

export default {
  reducer,
  sync,
  clear,
  logout,
  syncMetadata,
  clearMetadata,
};
