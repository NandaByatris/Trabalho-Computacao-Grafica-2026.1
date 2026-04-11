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

let plane = createGroundPlaneWired(100, 100, 50, 50); // plano azul quadriculado
scene.add(plane);

let arvore1 = criaArvoreBase(-7, 0);
scene.add(arvore1);
let arvore2 = criaArvoreFrutos(7, 0, 'firebrick');
scene.add(arvore2);
let arvore3 = criaArvoreNeve(0, 0);
scene.add(arvore3);

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

  function criaArvoreBase(x, z, corFolhas = 'forestgreen', corTronco = 'saddlebrown') // arvore triangular
  {
  let arvore = new THREE.Object3D(); // objeto para juntar os elementos da arvore
  
  let materialTronco = setDefaultMaterial(corTronco); // cria tronco
  let troncoGeometry = new THREE.CylinderGeometry(0.9, 0.9, 3, 32);
  let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
  tronco.position.set(0.0, 1.5, 0.0);
  arvore.add(tronco);
  
  let materialFolhas = setDefaultMaterial(corFolhas);
  let folhasTopoGeometry = new THREE.ConeGeometry(1.5, 2.5, 32); // cria folhas do topo
  let folhasTopo = new THREE.Mesh(folhasTopoGeometry, materialFolhas);
  folhasTopo.position.set(0.0, 6.5, 0.0);
  arvore.add(folhasTopo);
  let folhasMeioGeometry = new THREE.ConeGeometry(2, 3.5, 32); // cria folhas do meio
  let folhasMeio = new THREE.Mesh(folhasMeioGeometry, materialFolhas);
  folhasMeio.position.set(0.0, 5.5, 0.0);
  arvore.add(folhasMeio);
  let folhasBaseGeometry = new THREE.ConeGeometry(2.5, 4.5, 32); // cria folhas de baixo
  let folhasBase = new THREE.Mesh(folhasBaseGeometry, materialFolhas);
  folhasBase.position.set(0.0, 4.25, 0.0);
  arvore.add(folhasBase);
  
  arvore.position.set(x, 0.0, z); // escolhe a posicao no plano mas deixa no chão
  return arvore; // retorna a arvore pronta
}

function posicionaFrutos(x, y, z, corFruto) // ajuda a posicionar os frutos na arvore
{
  let materialFrutos = setDefaultMaterial(corFruto);
  let frutosGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  let fruto = new THREE.Mesh(frutosGeometry, materialFrutos);
  fruto.position.set(x, y, z);
  return fruto; // retorna o fruto pronto p ser adicionado
}

function criaArvoreFrutos(x, z, corFruto) // cria arvore de frutos, escolhendo a cor do fruto
{
  let arvore = criaArvoreBase(x, z); // cria a arvore base
  
  arvore.add(posicionaFrutos(0.7, 6, 0.7, corFruto)); // usa a funcao para escolher a posicao dos frutos
  arvore.add(posicionaFrutos(-1, 4.7, 1, corFruto)); // e os adiciona a arvore criada (objeto 3D)
  arvore.add(posicionaFrutos(1.25, 3.2, 1.25, corFruto));
  arvore.add(posicionaFrutos(-1.25, 4.2, -1.25, corFruto));
  arvore.add(posicionaFrutos(0.85, 5.7, -0.85, corFruto));
  arvore.add(posicionaFrutos(1.6, 2.4, -1.6, corFruto));
  arvore.add(posicionaFrutos(-1.6, 2.4, 1.6, corFruto));
  arvore.add(posicionaFrutos(-0.5, 6.5, -0.5, corFruto));
  
  return arvore;
}

function criaArvoreNeve(x, z) // cria arvore com neve
{
  let arvore = criaArvoreBase(x, z, 'darkgreen'); // arvore base com verde mais escuro
  let materialNeve = setDefaultMaterial('snow');

  let nevePontaGeometry = new THREE.ConeGeometry(0.6, 1, 32); // pontinha da arvore com neve
  let nevePonta = new THREE.Mesh(nevePontaGeometry, materialNeve);
  nevePonta.position.set(0.0, 7.26, 0.0);
  arvore.add(nevePonta);
  let neveTopoGeometry = new THREE.CylinderGeometry(1.2, 1.5, 0.5, 32); // neve da borda das folhas de cima
  let neveTopo = new THREE.Mesh(neveTopoGeometry, materialNeve);
  neveTopo.position.set(0.0, 5.51, 0.0); // 0.01 mais p cima p nao bugar
  arvore.add(neveTopo);
  let neveMeioGeometry = new THREE.CylinderGeometry(1.71, 2, 0.5, 32); // neve da borda das folhas do meio
  let neveMeio = new THREE.Mesh(neveMeioGeometry, materialNeve);
  neveMeio.position.set(0.0, 4.01, 0.0);
  arvore.add(neveMeio);
  let neveBaseGeometry = new THREE.CylinderGeometry(2.22, 2.5, 0.5, 32); // neve da borda das folhas de baixo
  let neveBase = new THREE.Mesh(neveBaseGeometry, materialNeve);
  neveBase.position.set(0.0, 2.26, 0.0);
  arvore.add(neveBase); // adiciona as neves na arvore base

  return arvore;
}

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}