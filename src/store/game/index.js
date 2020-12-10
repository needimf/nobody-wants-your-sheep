import { combineReducers } from 'redux';
import { getStatusActionTypes, getStatusReducers } from '../_utilities/statusReducer';

import privatePlayerData from './privatePlayerData';

const name = 'GAME';
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
  privatePlayerData: privatePlayerData.reducer,
});

// sync methods for data

export function sync(gameId) {
  return async (dispatch, getState) => {
    const path = `games/${gameId}/state`;
    firebase.database().ref(path).on('value', (snapshot) => {
      dispatch({ type: actionTypes.fetchSuccess, data: snapshot.val(), paths: { [path]: true } });
    });

    await privatePlayerData.sync()(dispatch, getState);
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

export function syncPrivatePlayerData() {
  return async (dispatch, getState) => privatePlayerData.sync()(dispatch, getState);
}

export function clearPrivatePlayerData() {
  return async (dispatch, getState) => privatePlayerData.clear()(dispatch, getState);
}

// action creators for game play
export function create(data) {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.createStart });
    const newGame = await firebase.database().ref('games').push();
    const newGameData = {
      ...data,
      _id: newGame.key(),
      _createdAt: Date.now(),
    };
    return newGame.set(newGameData, (error) => {
      if (error) {
        dispatch({ type: actionTypes.createError, data: { error }});
      } else {
        dispatch({ type: actionTypes.createSuccess });
      }
    });
  };
}

export default {
  reducer,
  sync,
  clear,
  syncPrivatePlayerData,
  clearPrivatePlayerData,
};

// Private Helpers
function generateGameGrid() {
  const board = {};
  const maxDistance = 5;
  const pointsOutOfBound = {
    '5,0,5': true,
    '5,1,4': true,
    '4,-1,5': true,
    '-5,0,-5': true,
    '-5,-1,-4': true,
    '-4,1,-5': true,
    '0,5,-5': true,
    '1,5,-4': true,
    '-1,4,-5': true,
    '0,-5,5': true,
    '1,-4,5': true,
    '-1,-5,4': true,
    '5,5,0': true,
    '5,4,1': true,
    '4,5,-1': true,
    '-5,-5,0': true,
    '-4,-5,1': true,
    '-5,-4,-1': true,
  };
  const tileCenters = {
    '0,0,0': true,
    '0,-3,3': true,
    '0,3,-3': true,
    '1,-1,2': true,
    '1,2,-1': true,
    '2,1,1': true,
    '2,-2,4': true,
    '2,4,-2': true,
    '3,0,3': true,
    '3,3,0': true,
    '4,2,2': true,
    '-1,1,-2': true,
    '-1,-2,1': true,
    '-2,-1,-1': true,
    '-2,-4,2': true,
    '-2,2,-4': true,
    '-3,0,-3': true,
    '-3,-3,0': true,
    '-4,-2,-2': true,
  };

  for (let i = 0; i <= maxDistance; i += 1) {

    for (let x = -i; x <= i; x += 1) {
      for (let y = -i; y <= i; y += 1) {
        const z = x - y;

        // check that distance is correct
        if (_calculateManhattanDistance({ x: 0, y: 0, z: 0 }, { x, y, z }) === i) {
          const coordinate = `${x},${y},${z}`;
          board[coordinate] = pointsOutOfBound[coordinate] ?
            null
            :
            {
              type: tileCenters[coordinate] ? 'tile' : 'point',
            };
        }
      }
    }
  }

  return board;
}

function assignTypesAndNumberTokensToTiles(gameBoard) {
  const tileCoordinates = Object.keys(gameBoard).filter((coordinate) => gameBoard[coordinate] && gameBoard[coordinate].type === 'tile');
  const typesToBeAssigned = { ...TILES };
  const traditionalNumberAssignment = [...TRADITIONAL_NUMBER_ASSIGNMENT];
  const tileAssignments = {};


  tileCoordinates.forEach((coordinate) => {
    const tileTypes = Object.keys(typesToBeAssigned).filter((type) => typesToBeAssigned[type] > 0);
    const typeToAssign = tileTypes[getRandomInt(0, tileTypes.length)];

    tileAssignments[coordinate] = {
      type: typeToAssign,
    };

    typesToBeAssigned[typeToAssign] -= 1;
  });
  // Handle number assignments
  // Traditional
  let desertOffset = 0;
  traditionalNumberAssignment.forEach((assignment, index) => {
    if (tileAssignments[assignment.coordinate].type === 'desert') {
      desertOffset = 1;
      return;
    }
    tileAssignments[assignment.coordinate].numberToken = traditionalNumberAssignment[index - desertOffset].number;
  });

  // TODO: Random assignment option (use _getCoordinatesNDistanceAway)
  // const numberTokensToBeAssigned = { ...NUMBER_TOKENS };
  // const numberTokens = Object.keys(numberTokensToBeAssigned).filter((tile) => numberTokensToBeAssigned[tile] > 0);
  // const numberToken = numberTokens[getRandomInt(0, numberTokens.length)];
  // tileAssignments[coordinate].numberToken = numberToken;
  // numberTokensToBeAssigned[numberToken] -= 1;

  return tileAssignments;
}

// function _getCoordinatesNDistanceAway(coordinate, n) {
//   const coordinates = [];
//   const [x, y, z] = coordinate.split(',');
//   for (let adjustment = -n; adjustment <= n; adjustment += 1) {
//     coordinates.push(`${x},${y + adjustment},${z - adjustment}`);
//     coordinates.push(`${x + adjustment},${y},${z + adjustment}`);
//     coordinates.push(`${x + adjustment},${y + adjustment},${z}`);
//   }
//   return coordinates;
// }
function _getCoordinatesOneDistanceAway(coordinate) {
  const coordinates = [];
  const [x, y, z] = coordinate.split(',');
  for (let adjustment = -1; adjustment <= 1; adjustment += 1) {
    coordinates.push(`${x},${y + adjustment},${z - adjustment}`);
    coordinates.push(`${x + adjustment},${y},${z + adjustment}`);
    coordinates.push(`${x + adjustment},${y + adjustment},${z}`);
  }
  return coordinates;
}

function _calculateManhattanDistance(origin, point) {
  return (Math.abs(origin.x - point.x) + Math.abs(origin.y - point.y) + Math.abs(origin.z - point.z)) / 2;
}

function getResourceCards(gameType) {
  switch (gameType) {
    case 'classic':
    default:
      return {
        wood: 19,
        brick: 19,
        ore: 19,
        sheep: 19,
        wheat: 19,
      };
      
  }
}

function getDevCards(gameType) {
  switch (gameType) {
    case 'classic':
    default:
      return {
        knight: 14,
        victoryPoint: 5,
        roadBuilder: 2,
        monopoly: 2,
        yearOfPlenty: 2,
      };
  }
}

const TILES = {
  brick: 3,
  wood: 4,
  ore: 3,
  wheat: 4,
  sheep: 4,
  desert: 1,
};

const TRADITIONAL_NUMBER_ASSIGNMENT = [
  { coordinate: '2,4,-2', number: 5 },
  { coordinate: '0,3,-3', number: 2 },
  { coordinate: '-2,2,-4', number: 6 },
  { coordinate: '-3,0,-3', number: 3 },
  { coordinate: '-4,-2,-2', number: 8 },
  { coordinate: '-3,-3,0', number: 10 },
  { coordinate: '-2,-4,2', number: 9 },
  { coordinate: '0,-3,3', number: 12 },
  { coordinate: '2,-2,4', number: 11 },
  { coordinate: '3,0,3', number: 4 },
  { coordinate: '4,2,2', number: 8 },
  { coordinate: '3,3,0', number: 10 },
  { coordinate: '1,2,-1', number: 9 },
  { coordinate: '-1,1,-2', number: 4 },
  { coordinate: '-2,-1,-1', number: 5 },
  { coordinate: '-1,-2,1', number: 6 },
  { coordinate: '1,-1,2', number: 3 },
  { coordinate: '2,1,1', number: 11 },
  { coordinate: '0,0,0', number: null },
];
