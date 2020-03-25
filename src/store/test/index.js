import firebase from '../../firebase';

export default (state = {}, action) => {
  switch(action.type) {
    case 'sync':
      return {...state, test: action.payload };
    default:
      return state;
  }
};

export const sync = () => async dispatch => {
  firebase.database().ref('test').on('value', (snapshot) => {
    console.log(snapshot.val());
    dispatch({ type: 'sync', payload: snapshot.val() });
  });
}
