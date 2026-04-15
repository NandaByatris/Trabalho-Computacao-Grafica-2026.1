import * as THREE from 'three';
import { FlyControls } from '../build/jsm/controls/FlyControls.js';
import Stats from '../build/jsm/libs/stats.module.js';
import {initRenderer, 
        SecondaryBox,
        initDefaultBasicLight,
        onWindowResize, 
        InfoBox,
        createGroundPlaneWired} from "../libs/util/util.js";
import { Color } from '../build/three.core.js';
import { criaCenarioVerao, criaCenarioInverno, criaCenarioOutono, criaCenarioPrimavera, criaCenario } from './ambiente.js';
import { criarAviao } from './aviao.js';

var scene = new THREE.Scene();   // Cria a cena principal
const clock = new THREE.Clock(); // Cria um relógio para controlar o tempo entre os frames
initDefaultBasicLight(scene, true);    // Use a iluminação padrão

const container = document.getElementById( 'container' );
const stats = new Stats();
container.appendChild( stats.dom );

var renderer = initRenderer();   // Função de visualização em util/utils
  renderer.setClearColor("lightblue"); // Define a cor de fundo do renderizador
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // Cria a câmera
  camera.position.set(0.0, 0.0, 0.0); // Define a posição inicial da câmera
  camera.up.set( 0, 0, 0 ); // Define a direção "para cima" da câmera

window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false ); // Escuta as mudanças no tamanho da janela para ajustar a câmera e o renderizador

let cameraBox = new THREE.Object3D();
cameraBox.add(camera); // Adiciona a câmera a um objeto vazio (cameraBox) para facilitar o controle do movimento da câmera
scene.add(cameraBox); // Adiciona o cameraBox à cena

for (let i = 0; i < 3; i++) {
  scene.add(criaCenario(0, -30, i * -100, 'primavera')); // Adiciona os cenários à cena, posicionando-os em intervalos regulares ao longo do eixo Z
}

const aviao = criarAviao();
aviao.position.set(0, 0, -30);
aviao.rotateY(Math.PI/2); // Gira o avião para que ele fique voltado para a direção correta (para frente)
cameraBox.add(aviao); // Adiciona o avião à cena

scene.fog = new THREE.Fog(new Color("lightblue"), 0.1, 200); // Adiciona neblina à cena para criar um efeito de profundidade, usando a mesma cor do fundo para que os objetos desapareçam gradualmente à medida que se afastam da câmera

var target = new THREE.Vector3(0, 0, 0); // Variável para armazenar a posição alvo para a câmera, que será atualizada com base na posição do mouse

window.addEventListener('mousemove', (event) => { // Executa o movimento do mouse para atualizar a posição alvo da câmera
        let x = (event.clientX / window.innerWidth) * 2 - 1; // Normaliza a posição do mouse no eixo X para o intervalo [-1, 1]
        let y = (event.clientY / window.innerHeight) * 2 - 1; // Normaliza a posição do mouse no eixo Y para o intervalo [-1, 1]

        target.x = x * 20; // Atualiza a posição alvo da câmera no eixo X com base na posição do mouse, multiplicando por 20 para ampliar o movimento
        target.y = -y * 15; // Atualiza a posição alvo da câmera no eixo Y  com base na posição do mouse, multiplicando por -20 para ampliar o movimento e inverter a direção
    });

var infoBox = new SecondaryBox(""); // Cria uma caixa de informações para exibir instruções ou detalhes sobre o controle

function showInformation(){ // Função para mostrar as informações na caixa de informações
  var controls = new InfoBox(); // Cria um objeto InfoBox para exibir as informações
  controls.add("Controle com maouse"); // Adiciona uma linha de texto à caixa de informações
  controls.add("Movimento no plano"); // Adiciona outra linha de texto à caixa de informações
  controls.show(); // 
}
render(); // Inicia o loop de renderização para atualizar a cena continuamente

function render() // Função de renderização que é chamada a cada frame para atualizar a cena
{
  stats.update();
  const delta = clock.getDelta(); // Calcula o tempo decorrido desde o último frame usando o relógio, o que pode ser útil para animações ou movimentos suaves

  aviao.position.x += (target.x - aviao.position.x) * 0.03; // Atualiza a posição da câmera no eixo X para se aproximar da posição alvo, usando uma interpolação suave multiplicada por 0.05 para controlar a velocidade do movimento
  cameraBox.position.z -= 0.5; // Atualiza a posição da câmera no eixo Z para se aproximar da posição alvo, usando uma interpolação suave multiplicada por 0.05 para controlar a velocidade do movimento
  aviao.position.y += (target.y - aviao.position.y) * 0.03; // Mantém a posição da câmera no eixo Y constante em 15, para que a câmera se mova apenas no plano XZ
  camera.lookAt(cameraBox.position.x, cameraBox.position.y, cameraBox.position.z - 30); // Faz a câmera olhar para um ponto à frente dela, ajustando a posição de destino para que a câmera olhe para um ponto 30 unidades à frente no eixo Z, mantendo a mesma posição no eixo X e Y

  requestAnimationFrame(render); // Solicita que a função de renderização seja chamada novamente no próximo frame, criando um loop de animação contínuo
  renderer.render(scene, camera) // Renderiza a cena usando a câmera, atualizando o que é exibido na tela com base nas mudanças feitas na cena e na posição da câmera
}