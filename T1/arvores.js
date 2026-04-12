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

let ambiente = new THREE.Object3D(); // objeto p juntar os elementos do ambiente
let plane = createGroundPlaneWired(100, 100, 50, 50, 5, 'darkgreen', 'green'); // plano quadriculado verde
ambiente.add(plane);

// ambiente.add(criaArvoreVerao(0, 0)); // arvore normal (verao?)
// ambiente.add(criaArvoreMaca(14, 0)); // arvore de maça (primavera?)
// ambiente.add(criaArvoreLaranja(7, 0)); // arvore de laranja (primavera?)
// ambiente.add(criaArvoreInverno(-7, 0)); //arvore com neve (inverno)
// ambiente.add(criaArvoreOutono(-14, 0)); // arvore outono
ambiente.add(criaArvoreRedonda(0, 0)); // arvore redonda
ambiente.add(criaArvoreRedonda(9, 0)); // arvore redonda
ambiente.add(criaArvoreRedonda(18, 0)); // arvore redonda
ambiente.add(criaArvoreRedonda(-9, 0)); // arvore redonda
ambiente.add(criaArvoreRedonda(-18, 0)); // arvore redonda

scene.add(ambiente);

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

function criaArvoreRedonda(x, z) // arvore redonda
{
  let arvore = new THREE.Object3D();

  const altura = (Math.random() * (7.0 - 5.0) + 5.0); // varia altura entre 5.0 e 7.0
  
  let materialTronco = setDefaultMaterial('saddlebrown');
  let troncoGeometry = new THREE.CylinderGeometry(0.9, 0.9, altura, 32);
  let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
  tronco.position.set(0.0, altura / 2, 0.0);
  arvore.add(tronco);

  for (let i = 0; i < 10; i++) // cria varias folhas redondas com posicoes e tamanhos variados
  {
    let raio = (Math.random() * (2.6 - 1.3) + 1.3); // varia o raio entre 1.3 e 2.6
    let folha = criaFolhasRedondas(raio, (Math.random() * 2 - 1) * 2, (Math.random() * 2 - 1) * 2 + altura, (Math.random() * 2 - 1) * 2);
    arvore.add(folha);
  }

  arvore.position.set(x, 0.0, z);

  return arvore;
}

function criaFolhasRedondas(raio, x, y, z, corFolhas = 'forestgreen')
{
  let materialFolhas = setDefaultMaterial(corFolhas);
  let folhaGeometry = new THREE.SphereGeometry(raio, 32, 32);
  let folha = new THREE.Mesh(folhaGeometry, materialFolhas);
  folha.position.set(x, y, z);
  return folha;
}

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
  
  arvore.position.set(x, 0.0, z); // escolhe a posicao no plano mas deixa no "chão"

  const altura = (Math.random() * (1.3 - 0.7) + 0.7); // varia altura entre 0.7x e 1.3x
  const largura = (Math.random() * (1.1 - 0.8) + 0.8); // varia largura entre 0.8x e 1.1x
  arvore.scale.set(largura, altura, largura); 

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

function criaArvoreOutono(x, z) { return criaArvoreBase(x, z, 'darkgoldenrod', 'sienna'); } // cria arvore com as cores de outono

function criaArvoreVerao(x, z) { return criaArvoreBase(x, z); } // cria arvore base para o verao

function criaArvoreInverno(x, z) { return criaArvoreNeve(x, z); } // cria arvore com neve para o inverno

function criaArvoreMaca(x, z) { return criaArvoreFrutos(x, z, 'firebrick'); } // cria arvore de maça

function criaArvoreLaranja(x, z) { return criaArvoreFrutos(x, z, 'chocolate'); } // cria arvore de laranja

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}