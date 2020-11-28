export function getStatusActionTypes(name) {
  return {
    clear: `${name}_CLEAR`,
    clearErrors: `${name}_CLEAR_ERRORS`,
    fetchStart: `${name}_FETCH_START`,
    fetchSuccess: `${name}_FETCH_SUCCESS`,
    fetchError: `${name}_FETCH_ERROR`,
    updateStart: `${name}_UPDATE_START`,
    updateSuccess: `${name}_UPDATE_SUCCESS`,
    updateError: `${name}_UPDATE_ERROR`,
    createStart: `${name}_CREATE_START`,
    createSuccess: `${name}_CREATE_SUCCESS`,
    createError: `${name}_CREATE_ERROR`,
    deleteStart: `${name}_DELETE_START`,
    deleteSuccess: `${name}_DELETE_SUCCESS`,
    deleteError: `${name}_DELETE_ERROR`,
  };
}

const defaultState = {
  fetchingError: undefined,
  creatingError: undefined,
  updatingError: undefined,
  deletingError: undefined,
};

export function getStatusReducers(name) {
  const namespace = name.toUpperCase();
  let diff = {};

  return ((state = {}, action) => {
    switch (action.type) {
      case `${namespace}_CLEAR`:
        return { ...defaultState };
      case `${namespace}_CLEAR_ERRORS`:
        diff = { ...defaultState };
        return { ...state, ...diff };
      case `${namespace}_FETCH_START`:
        diff = {
          fetching: true,
          fetchingError: undefined,
          fetched: undefined,
        };
        return { ...state, ...diff };
      case `${namespace}_FETCH_SUCCESS`:
        diff = {
          fetching: undefined,
          fetchingError: undefined,
          fetched: true,
        };
        return { ...state, ...diff };
      case `${namespace}_FETCH_ERROR`:
        diff = {
          fetching: undefined,
          fetchingError: action.data.error,
          fetched: undefined,
        };
        return { ...state, ...diff };
      case `${namespace}_CREATE_START`:
        diff = {
          creating: true,
          creatingError: undefined,
          created: undefined,
        };
        return { ...state, ...diff };
      case `${namespace}_CREATE_SUCCESS`:
        diff = {
          creating: undefined,
          creatingError: undefined,
          created: true,
        };
        return { ...state, ...diff };
      case `${namespace}_CREATE_ERROR`:
        diff = {
          creating: undefined,
          creatingError: action.data.error,
          created: undefined,
        };
        return { ...state, ...diff };
      case `${namespace}_UPDATE_START`:
        diff = {
          updating: true,
          updatingError: undefined,
          updated: undefined,
        };
        return { ...state, ...diff };
      case `${namespace}_UPDATE_SUCCESS`:
        diff = {
          updating: undefined,
          updatingError: undefined,
          updated: true,
        };
        return { ...state, ...diff };
      case `${namespace}_UPDATE_ERROR`:
        diff = {
          updating: undefined,
          updatingError: action.data.error,
          updated: undefined,
        };
        return { ...state, ...diff };
      case `${namespace}_DELETE_START`:
        diff = {
          deleting: true,
          deletingError: undefined,
          deleted: undefined,
        };
        return { ...state, ...diff };
      case `${namespace}_DELETE_SUCCESS`:
        diff = {
          deleting: undefined,
          deletingError: undefined,
          deleted: true,
        };
        return { ...state, ...diff };
      case `${namespace}_DELETE_ERROR`:
        diff = {
          deleting: undefined,
          deletingError: action.data.error,
          deleted: undefined,
        };
        return { ...state, ...diff };
      default:
        return state;
    }
  });
}
