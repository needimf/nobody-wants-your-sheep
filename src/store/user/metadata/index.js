import { combineReducers } from 'redux';
import { getStatusActionTypes, getStatusReducers } from '../../_utilities/statusReducer';

const name = 'USER_METADATA';
const actionTypes = getStatusActionTypes(name);

const initialState = {
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
      };

    default:
      return state;
  }
};

export const reducer = combineReducers({
  status: getStatusReducers(name),
  data: _reducer,
});

export function sync() {
  return async (dispatch, getState) => {
    const user = firebase.auth().currentUser;
    let name, email, uid;
    if (user !== null) {
      name = user.displayName;
      email = user.email;
      uid = user.uid;
    }
    dispatch({ type: actionTypes.fetchSuccess, data: { name, email, uid } });
  };
}

export function clear() {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.clear });
  };
}

export function logout() {
  return async (dispatch, getState) => firebase.auth().signOut();
}

export default {
  reducer,
  sync,
  clear,
  logout,
};
