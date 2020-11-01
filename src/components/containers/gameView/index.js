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

function Hex({index, tile}) {
  console.log('HEX tile' + tile);
  const positions = [[0,0,0], [1.73,0,0], [.868,0,1.49], [-.868,0,1.49], [-1.73, 0,0], [-.868, 0, -1.49],
                    [.868, 0, -1.49], [2.598, 0, -1.49], [3.46, 0, 0], [2.598, 0, 1.49], [1.73, 0, 2.98],
                    [0,0,2.98], [-1.73, 0, 2.98], [-2.598, 0, 1.49],[-3.46, 0, 0], [-2.598, 0, -1.49],
                    [-1.73, 0, -2.98], [0, 0, -2.98], [1.73, 0, -2.98]]
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
      <mesh position={positions[index]} rotation={[0, Math.PI / 2, 0]}>
        {/* <arrowHelper></arrowHelper> */}
        <cylinderBufferGeometry attach="geometry" args={[1,1,.01,6,1,false,11]} />
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
    console.log(this.props.gameState.tileAssignments)
    return (
      <Canvas
      camera={{ position: [0, 10, 0], fov: 70}}
      style={{width: window.innerWidth, height: window.innerHeight}}
      pixelRatio={window.pixelRatio}
      >
        <axesHelper args={1} />
        <Suspense fallback={null}>
          {Object.values(this.props.gameState.tileAssignments).map((tile, index) => {
            return (<Hex index={index} tile={tile} key={index} />);
          })}
          {/* <Hex index={0} tile={""} />
          <Hex index={1} tile={""} />
          <Hex index={2} tile={""} />
          <Hex index={3} tile={""} />
          <Hex index={4} tile={""} />
          <Hex index={5} tile={""} />
          <Hex index={6} tile={""} />
          <Hex index={7} tile={""} />
          <Hex index={8} tile={""} />
          <Hex index={9} tile={""} />
          <Hex index={10} tile={""} />
          <Hex index={11} tile={""} />
          <Hex index={18} tile={""} />
          <Hex index={12} tile={""} />
          <Hex index={13} tile={""} />
          <Hex index={14} tile={""} />
          <Hex index={15} tile={""} />
          <Hex index={16} tile={""} />
          <Hex index={17} tile={""} /> */}
        </Suspense>
        {/* <Line gameBoard={this.props.gameState.gameGrid} /> */}
      </Canvas>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameView);