import React, { Component, Suspense, useState, useRef} from 'react';
import { connect } from 'react-redux';
import * as THREE from 'three';
import { Canvas, useLoader, useThree, useFrame } from 'react-three-fiber';
import helvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json';

import './index.css';
import { LineBasicMaterial } from 'three';

const mapStateToProps = (state, props) => {
  return {
    gameState: state.gamePlay,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({})
}

function Hex({ position, tile }) {
  let img;
  switch (tile) {
    case 'ore':
      img = useLoader(THREE.TextureLoader, '../../assets/tiles/stoneTile.jpg');
      break;
    case 'wheat':
      img = useLoader(THREE.TextureLoader, '../../assets/tiles/wheatTile2.jpg');
      break;
    case 'brick':
      img = useLoader(THREE.TextureLoader, '../../assets/tiles/brickTile.jpg');
      break;
    case 'sheep':
      img = useLoader(THREE.TextureLoader, '../../assets/tiles/sheepTile.jpg');
      break;
    case 'wood':
      img = useLoader(THREE.TextureLoader, '../../assets/tiles/woodTile.jpg');
      break;
    default:
      img = useLoader(THREE.TextureLoader, '../../assets/tiles/desertTile2.jpg');
      break;
  }

  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderBufferGeometry attach="geometry" args={[10, 10, .01, 6]} />
      <meshBasicMaterial attach="material" map={img}>
      </meshBasicMaterial>
    </mesh>
  )
}

function Line({gameBoard}) {
  let board = gameBoard;
  let tileArray = [];
  let pointArray = [];
  let lineArray = [];
  Object.keys(board).map(key => {
    if(board[key] && board[key].type === 'tile') {
      key.split(',').forEach((string) => {
        tileArray.push(parseInt(string))
      });
    }
  });
  let i = 0;
  while(i < tileArray.length) {
    let center = [tileArray[i], tileArray[i+1], tileArray[i+2]]; // Center tile
    // Bottom Middle Point
    pointArray.push([center[0]-1, center[1]-1, center[2]]); 
    // Bottom Left Point
    pointArray.push([center[0]-1, center[1], center[2]-1]);
    // Top Left Point
    pointArray.push([center[0], center[1]+1, center[2]-1]);
    // Top Middle Point
    pointArray.push([center[0]+1, center[1]+1, center[2]]);
    // Top Right Point
    pointArray.push([center[0]+1, center[1], center[2]+1]);
    // Bottom Right Point
    pointArray.push([center[0], center[1]-1, center[2]+1]);
    for(let j = 0; j < 6; j++) {
      let coordinate = [...pointArray[(i/3)*6+j]];
      let x = coordinate[0];
      coordinate[0] = (coordinate[2] * (Math.sqrt(3)/2))*10;
      coordinate[1] = ((x + coordinate[1]) / 2) *10;
      coordinate[2] = .009;
      let coord1 = coordinate;
      coordinate = [...pointArray[(i/3)*6+((j+1)%6)]];
      x = coordinate[0];
      coordinate[0] = (coordinate[2] * (Math.sqrt(3)/2))*10;
      coordinate[1] = ((x + coordinate[1]) / 2) *10;
      coordinate[2] = .009;
      let coord2 = coordinate;
      if(!lineArray.includes([coord1,coord2]) && !lineArray.includes([coord2, coord1])) {
        lineArray.push([coord1, coord2]);
      }
    }
    i+=3;
  }
  const [hover, setHover] = useState(null);
  return (
    lineArray.map((vertex, index) => {
      vertex[0] = new THREE.Vector3(vertex[0][0], vertex[0][1], vertex[0][2]);
      vertex[1] = new THREE.Vector3(vertex[1][0], vertex[1][1], vertex[1][2]);
      return (
        <line 
          onPointerOver={(e) => {setHover(index)}} 
          onPointerOut={(e) => {setHover(null)}}
          key={index}
        >
          <geometry 
            attach="geometry" 
            vertices={vertex} 
          />
          <lineBasicMaterial attach="material" color={hover === index ? 'green' : 'white'} />
        </line>
        )
      })
  )
}

function Point({ gameBoard }) {
  let board = gameBoard;
  let coordinateArray = [];
  let pointArray = [];
  Object.keys(board).map(key => {
    if (board[key] && board[key].type === 'point') {
      key.split(',').forEach((string) => {
        coordinateArray.push(parseInt(string))
      });
    }
  });
  let i = 0;
  let copyArray = coordinateArray;
  while (i < coordinateArray.length) {
    let x = coordinateArray[i];
    coordinateArray[i] = (coordinateArray[i + 2] * (Math.sqrt(3) / 2)) * 10;
    coordinateArray[i + 1] = ((x + coordinateArray[i + 1]) / 2) * 10;
    coordinateArray[i + 2] = .01;
    pointArray.push([coordinateArray[i], coordinateArray[i + 1], coordinateArray[i + 2]]);
    i += 3;
  }
  let img = useLoader(THREE.TextureLoader, '../../assets/tiles/wheatTile2.jpg');
  return (
    pointArray.map((pointCoord, index) => {
      return (
      <mesh
        position={pointCoord}
        key={index}
        name={index}
      >
        <boxBufferGeometry attach="geometry" args={[2,2,.2]} />
        <meshBasicMaterial attach="material" color='white' />
      </mesh>
      )
    })
  )
}

function BoardRender({ gameBoard, tileData }) {
  let board = gameBoard;
  let tileArray = [];
  let tilePositions = [];
  Object.keys(board).map(key => {
    if (board[key] && board[key].type === 'tile') {
      // Set initial tile position
      let tilePos = [0, 0, 0];
      // Get tile position from board dictionary
      let tileXYZ = key.split(',');
      // Parse strings to ints
      tileXYZ[0] = parseInt(tileXYZ[0]);
      tileXYZ[1] = parseInt(tileXYZ[1]);
      tileXYZ[2] = parseInt(tileXYZ[2]);
      tilePositions.push(tileXYZ);
      // Calculate 2 coords from 3
      tilePos[0] = (tileXYZ[2] * (Math.sqrt(3)) / 2) * 10;
      tilePos[1] = ((tileXYZ[0] + tileXYZ[1]) / 2) * 10;
      tilePos[2] = 0;
      // Push array with point positions to Array
      tileArray.push(tilePos);
    }
  });
  return (
    // Map through array and render a Hex piece on each tile position, with associated tile type
    tileArray.map((pos, index) => {
      return (
        <Suspense fallback={null}>
          <Hex position={pos} key={index} tile={tileData[tilePositions[index]].type} />
          <NumberTile position={pos} number={tileData[tilePositions[index]].numberToken} key={index} />
        </Suspense>
      )
    })
  )
}

function NumberTile({ position, number }) {
  var loader = new THREE.FontLoader();
  var font = loader.parse(helvetikerBold);
  const config = { font, size: 6, height: 1, curveSegments: 20 };
  if (number === undefined) {
    number = '';
  }

  return (
    <mesh position={[position[0] - 3, position[1] - 4, position[2]]}>
      <textGeometry attach="geometry" center={true} args={[number.toString(), config]} />
      <meshBasicMaterial attach="material" color='black' />
    </mesh>
  )

}

class GameView extends Component {
  render() {
    return (
      <Canvas
        camera={{ position: [0, 0, 70], fov: 70 }}
        style={{ width: window.innerWidth / 2, height: window.innerHeight }}
        pixelRatio={window.pixelRatio}
        id="canvas"
      >
        <Suspense fallback={null}>
          <BoardRender gameBoard={this.props.gameState.gameGrid} tileData={this.props.gameState.tileAssignments} />
          <Point gameBoard={this.props.gameState.gameGrid} />
          <Line gameBoard={this.props.gameState.gameGrid} />
        </Suspense>
      </Canvas>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameView);