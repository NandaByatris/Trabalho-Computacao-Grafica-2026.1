import * as THREE from 'three';
import {FlyControls} from '../build/jsm/controls/OrbitControls.js';
import { InfoBox, initDefaultBasicLight, SecondaryBox } from '../libs/util/util';
import {initRenderer,
       SecondaryBox,
       initDefaultBasicLight,
       onWindowResize,
       InfoBox,
       CreateGroupPeople} from "../libs/util/util.js"; // é algo obrigatório importar todas essas bibliotecas ou eu posso ignorar? -> pesquisar

var scene = new THREE.Scene();    // Cria a cena principal que estaremos vendo no jogo
