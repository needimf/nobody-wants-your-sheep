import { combineReducers } from 'redux';
import { getStatusActionTypes, getStatusReducers } from '../../_utilities/statusReducer';

const name = 'PRIVATE_PlAYER_DATA';
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
        paths: { ...state.paths, ...action.paths },
      };

    default:
      return state;
  }
};

export const reducer = combineReducers({
  status: getStatusReducers(name),
  data: _reducer,
});

export function sync(gameId) {
  return async (dispatch, getState) => {
    const path = `games/${gameId}/privatePlayerState`;
    firebase.database().ref(path).on('value', (snapshot) => {
      dispatch({ type: actionTypes.fetchSuccess, data: snapshot.val(), paths: { [path]: true } });
    });
  };
}

export function clear() {
  return async (dispatch, getState) => {
    const { paths } = getState().user.data;
    Object.keys(paths).forEach((path) => {
      firebase.database().ref(path).off();
    });
    dispatch({ type: actionTypes.clear });
  };
}

export default {
  reducer,
  sync,
  clear,
};
