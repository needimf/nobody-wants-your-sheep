import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as Pixi from 'pixi.js';
import * as Honeycomb from 'honeycomb-grid';

const mapStateToProps = (state, props) => {
  return {
    gameId: state.location.payload.id
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({})
}
    
class GameBoard extends Component {
  componentDidMount() {
    this.app = new Pixi.Application({ width: window.innerWidth, height: window.innerHeight, transparent: false });
    this.app.renderer.backgroundColor = 0x061639;
    this.app.renderer.autoResize = true;
    this.graphics = new Pixi.Graphics()
    this.gameCanvas.appendChild(this.app.view);

    const Hex = Honeycomb.extendHex({ size: 50,
      edges: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'],
      type: '',
      num: 6,
      robber: false,
    });
    const Grid = Honeycomb.defineGrid(Hex);
    const grid1 = Grid.hexagon({radius: 2, center: [2,2]});

    this.graphics.lineStyle(1, 0x999999)

    // render 10,000 hexes
    grid1.forEach(hex => {
        const point = hex.toPoint()
        // add the hex's position to each of its corner points
        const corners = hex.corners().map(corner => corner.add(point))
        // separate the first from the other corners
        const [firstCorner, ...otherCorners] = corners

        // move the "pen" to the first corner
        this.graphics.moveTo(firstCorner.x, firstCorner.y)
        // draw lines to the other corners
        otherCorners.forEach(({ x, y }) => this.graphics.lineTo(x, y))
        // finish at the first corner
        this.graphics.lineTo(firstCorner.x, firstCorner.y)

        this.app.stage.addChild(this.graphics)
    });

    console.log(grid1);

    const gameBoard = _generateGameGrid();
    this.setState({
      gameBoard,
      ...assignTilesAndNumberTokensToNewBoard(gameBoard),
    });
  }

  render() {
    return (
      <div ref={(thisDiv) => {this.gameCanvas = thisDiv}} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);

// helpers

function _generateGameGrid() {
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

  for (let i = 0; i <= maxDistance; i++) {

    for (let x = -i; x <= i; x++) {
      for (let y = -i; y <= i; y++) {
        const z = x - y;

        // check that distance is correct
        if (_calculateManhattanDistance({ x: 0, y: 0, z: 0 }, { x, y, z }) === i) {
          const coordinate = `${x},${y},${z}`;
          board[coordinate] = pointsOutOfBound[coordinate] ?
            null
            :
            {
              type: tileCenters[coordinate] ? 'tile' : 'point',
            }
          }
      }
    }
  }

  return board;
}

function assignTilesAndNumberTokensToNewBoard(gameBoard) {
  const tileCoordinates = Object.keys(gameBoard).filter((coordinate) => gameBoard[coordinate] && coordinate !== '0,0,0' && gameBoard[coordinate].type === 'tile');
  let tileAssignmentCount = 0;
  const totalTilesToBeAssignedCount = Object.values(TILES).reduce((acc, cur) => acc + cur, 0)
  const tilesToBeAssigned = { ...TILES };
  const tileAssignments = {};

  const numberTokensToBeAssigned = { ...NUMBER_TOKENS };
  const numberTokenAssignments = {};

  while(tileAssignmentCount < totalTilesToBeAssignedCount) {
    const tileTypes = Object.keys(tilesToBeAssigned).filter(tile => tilesToBeAssigned[tile] > 0);
    const typeToAssign = tileTypes[getRandomInt(0, tileTypes.length)];
    const typeCanBeAssigned = ((tileAssignments[typeToAssign] && tileAssignments[typeToAssign].length) || 0) < TILES[typeToAssign];

    if (typeCanBeAssigned) {
      if (typeToAssign === 'desert') {
        const coordinate = '0,0,0';
        tileAssignments[coordinate] = typeToAssign;
      } else {
        const coordinate = tileCoordinates.pop();
        tileAssignments[coordinate] = typeToAssign;

        const numberTokens = Object.keys(numberTokensToBeAssigned).filter(tile => numberTokensToBeAssigned[tile] > 0);
        const numberToken = numberTokens[getRandomInt(0, numberTokens.length)];
        if (numberTokenAssignments[numberToken]) {
          numberTokenAssignments[numberToken].push(coordinate);
        } else {
          numberTokenAssignments[numberToken] = [coordinate];
        };
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
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
