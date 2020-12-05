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
  Object.keys(board).map(key => {
    if(board[key] && board[key].type === 'point') {
      key.split(',').forEach((string) => {
        tileArray.push(parseInt(string))
      });
    }
  });
  let i = 0;
  while(i < tileArray.length) {
    let x = tileArray[i];
    tileArray[i] = (tileArray[i+2] * (Math.sqrt(3)/2))*10;
    tileArray[i+1] = ((x + tileArray[i+1]) / 2) *10;
    tileArray[i+2] = .009;
    i+=3;
  }
  i = 1;
  var vertices = [];
  for(i; i<tileArray.length/3; i++) {
    var points = [];
    points.push(new THREE.Vector3(tileArray[(i-1)*3], tileArray[((i-1)*3)+1], tileArray[((i-1)*3)+2])); // Top Right
    points.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1], tileArray[(i*3)+2])); //Top Left
    vertices.push(points);
  }
  const [hover, setHover] = useState(null);
  return (
    <>
      {
        vertices.map((vertex, index) => (
          <line 
            key={index} 
            onPointerOver={(e) => {setHover(index)}} 
            onPointerOut={(e) => {setHover(null)}}
          >
            <geometry 
              attach="geometry" 
              vertices={vertex} 
            />
            <lineBasicMaterial attach="material" color={index === hover ? 'green' : 'white'} />
          </line>
          )
        )
      }
    </>
  )
}

function Point({ gameBoard }) {
  let board = gameBoard;
  let tileArray = [];
  Object.keys(board).map(key => {
    if (board[key] && board[key].type === 'point') {
      key.split(',').forEach((string) => {
        tileArray.push(parseInt(string))
      });
    }
  });
  let i = 0;
  let color = [];
  while (i < tileArray.length) {
    let x = tileArray[i];
    tileArray[i] = (tileArray[i + 2] * (Math.sqrt(3) / 2)) * 10;
    tileArray[i + 1] = ((x + tileArray[i + 1]) / 2) * 10;
    tileArray[i + 2] = .01;
    color.push(0);
    color.push(10);
    color.push(0);
    i += 3;
  }
  var positions = new Float32Array(tileArray);
  var colors = new Float32Array(color);
  const attrib = useRef();
  const over = e => {
    e.stopPropagation()
    attrib.current.array[e.index * 3] = 0
    attrib.current.array[e.index * 3 + 1] = 0
    attrib.current.array[e.index * 3 + 2] = 10
    attrib.current.needsUpdate = true
  }

  const out = e => {
    attrib.current.array[e.index * 3] = 0
    attrib.current.array[e.index * 3 + 1] = 10
    attrib.current.array[e.index * 3 + 2] = 0
    attrib.current.needsUpdate = true
  };
  return (
    <points
      onPointerOver={over}
      onPointerOut={out}
    >
      <bufferGeometry attach="geometry">
        <bufferAttribute attachObject={["attributes", "position"]} count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute ref={attrib} attachObject={["attributes", "color"]} count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial attach="material" vertexColors size={3} />
    </points>
  )
}

function BoardRender({ gameBoard, tileData }) {
  let board = gameBoard;
  let tileArray = [];
  let tilePositions = [];
  Object.keys(board).map(key => {
    if (board[key] && board[key].type === 'tile') {
      // Set initail tile position
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