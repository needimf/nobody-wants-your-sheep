import React, {Component, Suspense, useCallback, useState, useRef} from 'react';
import {connect} from 'react-redux';
import * as THREE from 'three';
import { Canvas, useLoader } from 'react-three-fiber';

import './index.css';

const mapStateToProps = (state, props) => {
  return {
    gameState: state.gamePlay,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({})
}

function Hex({position, tile}) {
  let img;
  // switch (tile) {
  //   case 'ore':
  //     img = useLoader(THREE.TextureLoader, "");
  //     break;
  //   case 'wheat':
  //     img = useLoader(THREE.TextureLoader, "");
  //     break;
  //   case 'brick':
  //     img = useLoader(THREE.TextureLoader, "");
  //     break;
  //   case 'sheep':
  //     img = useLoader(THREE.TextureLoader, "");
  //     break;
  //   case 'wood':
  //     img = useLoader(THREE.TextureLoader, "");
  //     break;
  //   default:
  //     img = useLoader(THREE.TextureLoader, "");
  //     break;
  // }
  const [hover, setHover] = useState(false);
  return (
    <>
      <mesh position={position} rotation={[Math.PI/2, 0, 0]} onPointerOver={()=> setHover(true)} onPointerOut={() => setHover(false)}>
        {/* <arrowHelper></arrowHelper> */}
        <cylinderBufferGeometry attach="geometry" args={[10,10,.01,6]} />
        <meshBasicMaterial attach="material" color={hover ? 'green' : 'blue'}>
        </meshBasicMaterial>
      </mesh>
    </>
  )
}

function Line({gameBoard}) {
  let board = gameBoard;
  let tileArray = [];
  Object.keys(board).map(key => {
    if(board[key] && board[key].type === 'tile') {
      key.split(',').forEach((string) => {
        tileArray.push(parseInt(string))
      });
    }
  });
  let i = 0;
  var vertices = [];
  while(i < 19) {
    var points = [];
    points.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1] + 1, tileArray[(i*3)+2] - 1)); //Top Left
    points.push(new THREE.Vector3(tileArray[i*3]+1, tileArray[(i*3)+1]+1, tileArray[(i*3)+2])); // Top Right
    points.push(new THREE.Vector3(tileArray[i*3]+1, tileArray[(i*3)+1], tileArray[(i*3)+2]+1)); // Right
    points.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1]-1, tileArray[(i*3)+2]+1)); // Bottom Right
    points.push(new THREE.Vector3(tileArray[i*3]-1, tileArray[(i*3)+1]-1, tileArray[(i*3)+2])); // Bottom Left
    points.push(new THREE.Vector3(tileArray[i*3]-1, tileArray[(i*3)+1], tileArray[(i*3)+2]-1)); // Left
    points.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1]+1, tileArray[(i*3)+2]-1)); // Top Left /To close hexagon
    ++i;
    vertices.push(points);
  }
  const update = useCallback((self) => ((self.verticesNeedUpdate = true), self.computeBoundingSphere()), [])
  return (
    <>
      {
        vertices.map((vertex, index) => (
          <line key={index}>
            <geometry attach="geometry" vertices={vertex} onUpdate={update} />
            <lineBasicMaterial attach="material" color="white" linecap='round' linejoin='round' />
          </line>
          )
        )
      }
    </>
  )
}

function Point({gameBoard}) {
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
  let color = [];
  while(i < tileArray.length) {
    let x = tileArray[i];
    tileArray[i] = (tileArray[i+2] * (Math.sqrt(3)/2))*10;
    tileArray[i+1] = ((x + tileArray[i+1]) / 2) *10;
    tileArray[i+2] = .1;
    color.push(0);
    color.push(0);
    color.push(10);
    i+=3;
  }
  var positions = new Float32Array(tileArray);
  var colors = new Float32Array(color);
  const attrib = useRef();
  const hover = useCallback(e => {
    e.stopPropagation()
    attrib.current.array[e.index * 3] = 0
    attrib.current.array[e.index * 3 + 1] = 10
    attrib.current.array[e.index * 3 + 2] = 0
    attrib.current.needsUpdate = true
  }, [])

  const unhover = useCallback(e => {
    attrib.current.array[e.index * 3] = 0
    attrib.current.array[e.index * 3 + 1] = 0
    attrib.current.array[e.index * 3 + 2] = 10
    attrib.current.needsUpdate = true
  }, [])
  return (
    <points 
      onPointerOver={hover}
      onPointerOut={unhover}
    >
      <bufferGeometry attach="geometry">
        <bufferAttribute attachObject={["attributes", "position"]} count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute ref={attrib} attachObject={["attributes", "color"]} count={colors.length /3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial attach="material" vertexColors size={3} />
    </points>
  )
}

function BoardRender({gameBoard}) {
  let board = gameBoard;
  let tileArray = [];
  Object.keys(board).map(key => {
    if(board[key] && board[key].type === 'tile') {
      // Set initail tile position
      let tilePos = [0,0,0];
      // Get tile position from board dictionary
      let tileXYZ = key.split(',');
      // Parse strings to ints
      tileXYZ[0] = parseInt(tileXYZ[0]);
      tileXYZ[1] = parseInt(tileXYZ[1]);
      tileXYZ[2] = parseInt(tileXYZ[2]);
      // Calculate 2 coords from 3
      tilePos[0] = (tileXYZ[2] * (Math.sqrt(3))/2) * 10;
      tilePos[1] = ((tileXYZ[0] + tileXYZ[1]) / 2) * 10;
      tilePos[2] = 0;
      // Push array with point positions to Array
      tileArray.push(tilePos);
    }
  });

  return (
    // Map through array and render a Hex piece on each tile position, with associated tile type
    tileArray.map((val, index) => {
      return(
        <Hex position={val} key={index} tile='hi' />
      )
    })
  )
}
    
class GameView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // scene: null,
      // camera: null,
      // renderer,
      // geometry,
      // geometry2,
      // vertices,
      positions: [],
      tileArray: [],
      ready: false,
      // colors,
      // sizes,
      // objects: [],
      // mouse,
      // raycaster
    }
  }

  render() {
    console.log(this.props.gameState)
    return (
      <Canvas
      camera={{ orthographic: true, position: [0, 0, 70]}}
      style={{width: window.innerWidth, height: window.innerHeight}}
      pixelRatio={window.pixelRatio}
      >
        <axesHelper args={10} />
        <Suspense fallback={null}>
          <BoardRender gameBoard={this.props.gameState.gameGrid} />
          <Point gameBoard={this.props.gameState.gameGrid} />
        </Suspense>
      </Canvas>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameView);