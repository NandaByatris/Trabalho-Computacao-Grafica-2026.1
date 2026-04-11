import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ,
        createGroundPlaneWired} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
scene.add(camera); // Add camera to the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

let plane = createGroundPlaneWired(100, 100, 50, 50);
scene.add(plane);

let arvore = criaArvoreBase(0, 0);
scene.add(arvore);

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();
  
  render();

  function criaArvoreBase(x, z, corFolhas = 'forestgreen', corTronco = 'saddlebrown')
  {
  let arvore = new THREE.Object3D();
  
  let materialTronco = setDefaultMaterial(corTronco);
  let troncoGeometry = new THREE.CylinderGeometry(0.9, 0.9, 3, 32);
  let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
  tronco.position.set(0.0, 1.5, 0.0);
  arvore.add(tronco);
  
  let materialFolhas = setDefaultMaterial(corFolhas);
  let folhasTopoGeometry = new THREE.ConeGeometry(1.5, 2.5, 32);
  let folhasTopo = new THREE.Mesh(folhasTopoGeometry, materialFolhas);
  folhasTopo.position.set(0.0, 6.5, 0.0);
  arvore.add(folhasTopo);
  let folhasMeioGeometry = new THREE.ConeGeometry(2, 3.5, 32);
  let folhasMeio = new THREE.Mesh(folhasMeioGeometry, materialFolhas);
  folhasMeio.position.set(0.0, 5.5, 0.0);
  arvore.add(folhasMeio);
  let folhasBaseGeometry = new THREE.ConeGeometry(2.5, 4.5, 32);
  let folhasBase = new THREE.Mesh(folhasBaseGeometry, materialFolhas);
  folhasBase.position.set(0.0, 4.25, 0.0);
  arvore.add(folhasBase);
  
  arvore.position.set(x, 0.0, z);
  return arvore;
}

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}