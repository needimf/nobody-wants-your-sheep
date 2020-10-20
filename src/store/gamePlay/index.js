const initialState = {
  gameGrid: {},
  tileAssignments: {},
  numberTokenAssignments: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'initializeGame': {
      const gameGrid = generateGameGrid();
      const { tileAssignments, numberTokenAssignments } = assignTilesAndNumberTokensToNewBoard(gameGrid);

      return {
        ...state,
        gameGrid,
        tileAssignments,
        numberTokenAssignments,
      };
    }
    default:
      return state;
  }
};

// export const sync = () => async (dispatch) => {
//   firebase.database().ref('test').on('value', (snapshot) => {
//     console.log(snapshot.val());
//     dispatch({ type: 'sync', payload: snapshot.val() });
//   });
// };

export const initializeGame = () => (dispatch) => {
  dispatch({ type: 'initializeGame' });
};

// internal functions
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

function assignTilesAndNumberTokensToNewBoard(gameBoard) {
  const tileCoordinates = Object.keys(gameBoard).filter((coordinate) => gameBoard[coordinate] && coordinate !== '0,0,0' && gameBoard[coordinate].type === 'tile');
  let tileAssignmentCount = 0;
  const totalTilesToBeAssignedCount = Object.values(TILES).reduce((acc, cur) => acc + cur, 0);
  const tilesToBeAssigned = { ...TILES };
  const tileAssignments = {};

  const numberTokensToBeAssigned = { ...NUMBER_TOKENS };
  const numberTokenAssignments = {};

  while (tileAssignmentCount < totalTilesToBeAssignedCount) {
    const tileTypes = Object.keys(tilesToBeAssigned).filter((tile) => tilesToBeAssigned[tile] > 0);
    const typeToAssign = tileTypes[getRandomInt(0, tileTypes.length)];
    const typeCanBeAssigned = ((tileAssignments[typeToAssign] && tileAssignments[typeToAssign].length) || 0) < TILES[typeToAssign];

    if (typeCanBeAssigned) {
      if (typeToAssign === 'desert') {
        const coordinate = '0,0,0';
        tileAssignments[coordinate] = typeToAssign;
      } else {
        const coordinate = tileCoordinates.pop();
        tileAssignments[coordinate] = typeToAssign;

        const numberTokens = Object.keys(numberTokensToBeAssigned).filter((tile) => numberTokensToBeAssigned[tile] > 0);
        const numberToken = numberTokens[getRandomInt(0, numberTokens.length)];
        if (numberTokenAssignments[numberToken]) {
          numberTokenAssignments[numberToken].push(coordinate);
        } else {
          numberTokenAssignments[numberToken] = [coordinate];
        }
        numberTokensToBeAssigned[numberToken] -= 1;
      }

      tilesToBeAssigned[typeToAssign] -= 1;
      tileAssignmentCount += 1;
    }
  }

  return { tileAssignments, numberTokenAssignments };
}

function _calculateManhattanDistance(origin, point) {
  return (Math.abs(origin.x - point.x) + Math.abs(origin.y - point.y) + Math.abs(origin.z - point.z)) / 2 
}

const TILES = {
  brick: 3,
  wood: 4,
  ore: 3,
  wheat: 4,
  sheep: 4,
  desert: 1,
};

const NUMBER_TOKENS = {
  2: 1,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  8: 2,
  9: 2,
  10: 2,
  11: 2,
  12: 1,
};

function getRandomInt(min, max) {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum)) + minimum; // The maximum is exclusive and the minimum is inclusive
}
