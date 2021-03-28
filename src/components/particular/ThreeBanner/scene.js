import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import { fetchData } from "./fetch.js"
// import * as dat from "dat.gui"
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

//GUI Debug
// const gui = new dat.GUI({closed:true})
// gui.hide()

// Sizes
const sizes = {
  // width: 300,
  // height: 150
  width: window.innerWidth,
  height: window.innerHeight
}

// Cámara
const fov = 20
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera( fov, aspect, 0.1, 1000 )
camera.position.x = 5;
camera.position.y = 3;
camera.position.z = 10;

// Material
// const material = new THREE.MeshStandardMaterial( 
//   {
//     // map: doorColorTexture,
//     color: "#666666", 
//     // side: THREE.DoubleSide
//     wireframe: true
//   }
// );
// material.roughness = 0.4

// Lights
// const ambientlight = new THREE.AmbientLight()
// ambientlight.color = new THREE.Color("#ffffff")
// ambientlight.intensity = 0.3
// ambientlight.position.set(-1, 3, 2)

// const rectAreaLight = new THREE.RectAreaLight("#3f2613", 4.3, 9, 9)
// rectAreaLight.position.set(5,10,2.5)
// rectAreaLight.lookAt(new THREE.Vector3())

// const pointLight = new THREE.PointLight( "#b4a48a", 1.5 )
// pointLight.position.x = 1
// pointLight.position.y = 3
// pointLight.position.z = 5
// color, intensidad, distancia, angulo, penumbra, 
// const spotLight = new THREE.SpotLight( 0xffffff, 3.4, 70, 13, 20, 0.05)
// pointLight.position.set(10,15,25)

// Geometria
const geometry2 = new THREE.BufferGeometry();
const coords = [
  0, 0,  0,
  1.0, -1.0,  1.0,
  1.0,  1.0,  1.0,

  1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0, -1.0,  1.0
]

const vertices = new Float32Array( coords );

console.log(coords)
geometry2.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material2 = new THREE.MeshBasicMaterial( {
  color: "white", 
  // side: THREE.DoubleSide
  wireframe: true
});
const mesh2 = new THREE.Mesh( geometry2, material2 );

// Escena
const scene = new THREE.Scene();
// scene.background = new THREE.Color();
scene.add( mesh2 )

// Helpers
const axesHelper = new THREE.AxesHelper( 10 );
scene.add( axesHelper );
const size = 20;
const divisions = 2;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

// Model loader
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath("/draco/")
// const loader = new GLTFLoader();
// loader.setDRACOLoader(dracoLoader)

// loader.load( 
//   '/models/draco2.glb', 
//   ( gltf ) => {
//     gltf.scene.traverse( node => 
//       { if (node.isMesh) { 
//         node.material = material; 
//         node.position.x = 0; 
//         camera.lookAt(node.position)
//       } }
//     );
// 	scene.add( gltf.scene )
//   console.log(gltf.scene)
// })

//GUI Debug
// gui.add(ambientlight, "intensity").min(0).max(2).step(0.1)
// gui.add(rectAreaLight, "intensity").min(0).max(20).step(0.1)

// Exporter
// const exporter = new GLTFExporter();
// exporter.parse(scene, function ( result ) {
//   const output = JSON.stringify( result, null, 2 );
//   saveString( output, 'scene.gltf' );
// }, null);
// function saveString( text, filename ) {
//   save( new Blob( [ text ], { type: 'text/plain' } ), filename );
// }
// function save( blob, filename ) {
//   link.href = URL.createObjectURL( blob );
//   link.download = filename;
//   link.click();
// }
// const link = document.createElement( 'a' );
// // link.style.display = 'none';
// document.body.appendChild( link );
// const canvas = document.querySelectorAll(".wegl")
// console.log(canvas)

// Animations
const clock = new THREE.Clock()
const animate = () => {
  const elapsedTime = clock.getElapsedTime()
  scene.rotation.y = 0.09 * elapsedTime
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

// Renderer
let renderer;

const resize = () => {
  sizes.width = window.innerWidth - 100;
  sizes.height = window.innerHeight - 400;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

export const createScene = (el) => {
  const controls = new OrbitControls(camera,el)
  controls.enabled = false;
  controls.enableZoom = false;
  controls.enableDamping = true
  controls.update()
  renderer = new THREE.WebGLRenderer(
    { 
      antialias: true, 
      canvas: el
    }
  );
  resize();
  animate();
};

window.addEventListener("resize", resize);
