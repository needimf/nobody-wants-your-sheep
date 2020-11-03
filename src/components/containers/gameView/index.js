import React, {Component, Suspense, useCallback} from 'react';
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
  switch (tile) {
    case 'ore':
      img = useLoader(THREE.TextureLoader, "https://1.bp.blogspot.com/-t7a4HzPEUa0/WH948JIm90I/AAAAAAAAEZI/ofFODClpqx0aCQ5TyGc_Q1bRg0YSe83sgCLcB/s1600/iron.png");
      break;
    case 'wheat':
      img = useLoader(THREE.TextureLoader, "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRLCZWXF8sN2b6gvFTAUmkZtBXMdHQCVXOPQQ&usqp=CAU");
      break;
    case 'brick':
      img = useLoader(THREE.TextureLoader, "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSoCmlryLbo4b0QeopuY_LaRgbGumw5IQvaKA&usqp=CAU");
      break;
    case 'sheep':
      img = useLoader(THREE.TextureLoader, "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSVAKJ-oP9WNj7p6sLhFBR1tuXh30uT2fZVaA&usqp=CAU");
      break;
    case 'wood':
      img = useLoader(THREE.TextureLoader, "https://cdn.friendsoftheearth.uk/sites/default/files/styles/hero_image/public/media/images/wood-1209632_1920.jpg?itok=db72amh_");
      break;
    default:
      img = useLoader(THREE.TextureLoader, "https://upload.wikimedia.org/wikipedia/commons/3/34/Rub_al_Khali_002.JPG");
      break;
  }
  return (
    <>
      <mesh position={position} rotation={[Math.PI/2, 0, 0]}>
        {/* <arrowHelper></arrowHelper> */}
        <cylinderBufferGeometry attach="geometry" args={[1,1,.01,6]} />
        <meshBasicMaterial attach="material" map={img} color="white">
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
  while(i < tileArray.length) {
    let x = tileArray[i];
    tileArray[i] = tileArray[i+2] * (Math.sqrt(3)/2);
    tileArray[i+1] = (x + tileArray[i+1]) / 2;
    tileArray[i+2] = .1;
    i+=3;
  }

  var positions = new Float32Array(tileArray);

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute attachObject={["attributes", "position"]} count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial attach="material" color="white" size={.2} />
    </points>
  )
}

function BoardRender({gameBoard}) {
  let board = gameBoard;
  let tileArray = [];
  Object.keys(board).map(key => {
    if(board[key] && board[key].type === 'tile') {
      key.split(',').forEach((string) => {
        tileArray.push(parseInt(string))
      });
    }
  });
  console.log(tileArray);
  let i = 0;
  let tileArrayArray = [];
  while(i < tileArray.length) {
    let x = tileArray[i];
    tileArray[i] = tileArray[i+2] * (Math.sqrt(3)/2);
    tileArray[i+1] = (x + tileArray[i+1]) / 2;
    tileArray[i+2] = 0;
    tileArrayArray.push([tileArray[i], tileArray[i+1], tileArray[i+2]]);
    i+=3;
  }

  var positions = new Float32Array(tileArray);

  return (
    tileArrayArray.map((val, index) => {
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
      camera={{ position: [0, 0, 10], fov: 70}}
      style={{width: window.innerWidth, height: window.innerHeight}}
      pixelRatio={window.pixelRatio}
      >
        <axesHelper args={10} />
        {/* <Suspense fallback={null}>
          {Object.values(this.props.gameState.tileAssignments).map((tile, index) => {
            return (<Hex index={index} tile={tile} key={index} />);
          })}
        </Suspense> */}
        {/* <Point postion={[1, 1, 1]} /> */}
        <Suspense fallback={null}>
          <BoardRender gameBoard={this.props.gameState.gameGrid} />
          <Point gameBoard={this.props.gameState.gameGrid} />
        </Suspense>
        {/* <Line gameBoard={this.props.gameState.gameGrid} /> */}
      </Canvas>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameView);