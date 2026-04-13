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

ambiente.add(criaArvoreTriangularVerao(0, 10)); // arvore normal (verao?)
ambiente.add(criaArvoreTriangularMaca(14, 10)); // arvore de maça (primavera?)
ambiente.add(criaArvoreTriangularLaranja(7, 10)); // arvore de laranja (primavera?)
ambiente.add(criaArvoreTriangularInverno(-7, 10)); //arvore com neve (inverno)
ambiente.add(criaArvoreTriangularOutono(-14, 10)); // arvore outono
ambiente.add(criaArvoreRedondaVerao(0, -10)); // arvore redonda de maça
ambiente.add(criaArvoreRedondaLaranja(9, -10)); // arvore redonda de laranja
ambiente.add(criaArvoreRedondaMaca(18, -10)); // arvore redonda de maça
ambiente.add(criaArvoreRedondaNeve(-9, -10)); // arvore redonda com neve
ambiente.add(criaArvoreRedondaOutono(-18, -10)); // arvore redonda de outono

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

function criaArvoreRedonda(x, z, tipo = 'normal', corFolhas = 'forestgreen', corTronco = 'sienna') // arvore redonda
{
  let arvore = new THREE.Object3D();

  const altura = (Math.random() * (7.0 - 5.0) + 5.0); // varia altura entre 5.0 e 7.0
  
  let materialTronco = setDefaultMaterial(corTronco);
  let troncoGeometry = new THREE.CylinderGeometry(0.9, 0.9, altura, 32);
  let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
  tronco.position.set(0.0, altura / 2, 0.0);
  arvore.add(tronco);

  for (let i = 0; i < 10; i++) // cria varias folhas redondas com posicoes e tamanhos variados
  {
    let raio = (Math.random() * (2.6 - 1.3) + 1.3); // varia o raio entre 1.3 e 2.6
    let x = (Math.random() * 2 - 1) * 2;            // varia x entre -2 e 2
    let y = (Math.random() * 2 - 1) * 2 + altura;   // varia y entre -2 e 2 na altura da arvore
    let z = (Math.random() * 2 - 1) * 2;            // varia z entre -2 e 2

    let folha;
    if (tipo === 'normal'){
      folha = criaFolhasRedondas(raio, x, y, z, corFolhas);
    } else if (tipo === 'frutos') {
      folha = criaFolhasRedondasFrutos(raio, x, y, z, corFolhas);
      folha.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.random() * 2 * Math.PI); // rotaciona as folhas aleatoriamente
    } else if (tipo === 'neve') {
      folha = criaFolhasRedondasNeve(raio, x, y, z);
    }
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

function criaFolhasRedondasFrutos(raio, x, y, z, corFrutos = 'firebrick')
{
  let folha = criaFolhasRedondas(raio, x, y, z, 'forestgreen');
  folha.add(posicionaFrutos((raio/2 + 0.15), -(raio/2 + 0.15), -(raio/2 + 0.15), corFrutos)); // posiciona nas bordas das folhas
  folha.add(posicionaFrutos((raio/2 + 0.15), (raio/2 + 0.15), (raio/2 + 0.15), corFrutos));
  folha.add(posicionaFrutos(-(raio/2 + 0.15), (raio/2 + 0.15), -(raio/2 + 0.15), corFrutos));
  folha.add(posicionaFrutos(-(raio/2 + 0.15), -(raio/2 + 0.15), (raio/2 + 0.15), corFrutos));
  return folha;
}

function criaFolhasRedondasNeve(raio, x, y, z)
{
  let folha = criaFolhasRedondas(raio, x, y, z, 'darkgreen');
  let materialNeve = setDefaultMaterial('snow');
  let neveGeometry = new THREE.SphereGeometry(raio, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.4); // cria a parte de cima da folha com neve (metade da esfera)
  let neve = new THREE.Mesh(neveGeometry, materialNeve);
  neve.position.set(0, 0.1, 0); // posiciona a neve na parte de cima da folha
  folha.add(neve);
  return folha;
}

function criaArvoreTriangular(x, z, corFolhas = 'forestgreen', corTronco = 'sienna') // arvore triangular
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

function criaArvoreTriangularFrutos(x, z, corFruto) // cria arvore de frutos, escolhendo a cor do fruto
{
  let arvore = criaArvoreTriangular(x, z); // cria a arvore base
  
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

function criaArvoreTriangularNeve(x, z) // cria arvore com neve
{
  let arvore = criaArvoreTriangular(x, z, 'darkgreen'); // arvore base com verde mais escuro
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

function criaArvoreTriangularOutono(x, z) { return criaArvoreTriangular(x, z, 'darkgoldenrod', 'saddlebrown'); } // cria arvore com as cores de outono

function criaArvoreTriangularVerao(x, z) { return criaArvoreTriangular(x, z); } // cria arvore base para o verao

function criaArvoreTriangularInverno(x, z) { return criaArvoreTriangularNeve(x, z); } // cria arvore com neve para o inverno

function criaArvoreTriangularMaca(x, z) { return criaArvoreTriangularFrutos(x, z, 'firebrick'); } // cria arvore de maça

function criaArvoreTriangularLaranja(x, z) { return criaArvoreTriangularFrutos(x, z, 'chocolate'); } // cria arvore de laranja

function criaArvoreRedondaOutono(x, z) { return criaArvoreRedonda(x, z, 'normal', 'darkgoldenrod', 'saddlebrown'); } // cria arvore redonda de outono

function criaArvoreRedondaVerao(x, z) { return criaArvoreRedonda(x, z); } // cria arvore redonda normal (verao)

function criaArvoreRedondaNeve(x, z) { return criaArvoreRedonda(x, z, 'neve', 'snow', 'saddlebrown'); } // cria arvore redonda com neve

function criaArvoreRedondaMaca(x, z) { return criaArvoreRedonda(x, z, 'frutos', 'firebrick'); } // cria arvore redonda de maça

function criaArvoreRedondaLaranja(x, z) { return criaArvoreRedonda(x, z, 'frutos', 'chocolate'); } // cria arvore redonda de laranja

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}