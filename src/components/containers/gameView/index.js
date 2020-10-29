import React, {Component, useCallback} from 'react';
import {connect} from 'react-redux';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';

import './index.css';

const mapStateToProps = (state, props) => {
  return {
    gameState: state.gamePlay,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return ({})
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

  makePoints() {
      let board = this.props.gameState.gameGrid;
      let tileArray = [];
      Object.keys(board).map(key => {
        if(board[key] && board[key].type === 'tile') {
          key.split(',').forEach((string) => {
            tileArray.push(parseInt(string))
          });
        }
      });
      let count = 19;
      let vertices = []
      for (let i = 0; i < count; i++) {
        vertices.push(tileArray[i*3]);
        vertices.push(tileArray[(i*3)+1]);
        vertices.push(tileArray[(i*3)+2]);
        vertices.push(tileArray[i*3]);
        vertices.push(tileArray[(i*3)+1] + 1);
        vertices.push(tileArray[(i*3)+2] - 1);
        vertices.push(tileArray[i*3]+1);
        vertices.push(tileArray[(i*3)+1]+1);
        vertices.push(tileArray[(i*3)+2]);
        vertices.push(tileArray[i*3]+1);
        vertices.push(tileArray[(i*3)+1]);
        vertices.push(tileArray[(i*3)+2]+1);
        vertices.push(tileArray[i*3]);
        vertices.push(tileArray[(i*3)+1]-1);
        vertices.push(tileArray[(i*3)+2]+1);
        vertices.push(tileArray[i*3]-1);
        vertices.push(tileArray[(i*3)+1]-1);
        vertices.push(tileArray[(i*3)+2]);
        vertices.push(tileArray[i*3]-1);
        vertices.push(tileArray[(i*3)+1]);
        vertices.push(tileArray[(i*3)+2]-1);
      }
      let positions = new Float32Array(vertices);
      this.setState({...this.state, positions: positions}, () => {console.log('done')})
}
  // componentDidMount() {
  //   this.setState({...this.state, lineGeometry: new THREE.BufferGeometry()})
  // }
//   //   scene = new THREE.Scene();
//   //   camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1 ,1000 );
//   //   camera.position.z = 6;
//   //   camera.position.x = -6;
//   //   camera.position.y = 6;
//   //   camera.lookAt(new THREE.Vector3(0,0,0));
//   //   renderer = new THREE.WebGLRenderer();
//   //   renderer.setSize( window.innerWidth, window.innerHeight );
//   //   document.body.appendChild( renderer.domElement ); 
//   //   var i = 0;
//   //   geometry = new THREE.Geometry();
//   //   geometry2 = new THREE.Geometry();
//   //   while(i < 19) {
//   //     console.log(`${tileArray[i*3]}, ${tileArray[(i*3)+1]}, ${tileArray[(i*3)+2]}`);
//   //     geometry.vertices.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1], tileArray[(i*3)+2]));
//   //     geometry2.vertices.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1] + 1, tileArray[(i*3)+2] - 1))
//   //     geometry2.vertices.push(new THREE.Vector3(tileArray[i*3]+1, tileArray[(i*3)+1]+1, tileArray[(i*3)+2]))
//   //     geometry2.vertices.push(new THREE.Vector3(tileArray[i*3]+1, tileArray[(i*3)+1], tileArray[(i*3)+2]+1))
//   //     geometry2.vertices.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1]-1, tileArray[(i*3)+2]+1))
//   //     geometry2.vertices.push(new THREE.Vector3(tileArray[i*3]-1, tileArray[(i*3)+1]-1, tileArray[(i*3)+2]))
//   //     geometry2.vertices.push(new THREE.Vector3(tileArray[i*3]-1, tileArray[(i*3)+1], tileArray[(i*3)+2]-1))
//   //     var points = [];
//   //     points.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1] + 1, tileArray[(i*3)+2] - 1)); //Top Left
//   //     points.push(new THREE.Vector3(tileArray[i*3]+1, tileArray[(i*3)+1]+1, tileArray[(i*3)+2])); // Top Right
//   //     points.push(new THREE.Vector3(tileArray[i*3]+1, tileArray[(i*3)+1], tileArray[(i*3)+2]+1)); // Right
//   //     points.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1]-1, tileArray[(i*3)+2]+1)); // Bottom Right
//   //     points.push(new THREE.Vector3(tileArray[i*3]-1, tileArray[(i*3)+1]-1, tileArray[(i*3)+2])); // Bottom Left
//   //     points.push(new THREE.Vector3(tileArray[i*3]-1, tileArray[(i*3)+1], tileArray[(i*3)+2]-1)); // Left
//   //     points.push(new THREE.Vector3(tileArray[i*3], tileArray[(i*3)+1]+1, tileArray[(i*3)+2]-1)); // Top Left /To close hexagon
//   //     var geometryLine = new THREE.BufferGeometry().setFromPoints( points );
//   //     var line = new THREE.Line( geometryLine, material );
//   //     scene.add(line);
//   //     ++i;
//   //}
// }

  componentDidUpdate() {
    if(!this.state.ready) {
      this.setState({...this.state, ready: true}, () => {
        this.makePoints();
      });
    }
  }

  render() {
    return (
      <Canvas
      camera={{ position: [-6, 6, 6], fov: 70}}
      style={{width: window.innerWidth, height: window.innerHeight}}
      pixelRatio={window.pixelRatio}
      >
        <points>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attachObject={['attributes', 'position']}
              count={this.state.positions.length / 3}
              array={this.state.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={.1} color="white" transparent opacity={1.0} />
        </points>
        <Line gameBoard={this.props.gameState.gameGrid} />
      </Canvas>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameView);