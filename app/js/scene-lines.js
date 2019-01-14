import * as THREE from 'three';
import Perlin from './perlin';
const OrbitControls = require('three-orbit-controls')(THREE);

let camera,
  controls,
  scene,
  renderer,
  time = 0,
  groupX,
  groupY;

const size = 20;

const updateGrid = time => {
  for (let i = 0; i < size; i++) {
    const lineX = groupX.children[i];
    const lineY = groupY.children[i];
    for (let j = 0; j < size; j++) {
      const vecX = lineX.geometry.vertices[j];
      const vecY = lineY.geometry.vertices[j];
      vecX.z = 100 * Perlin(vecX.x / 100, vecX.y / 100, time / 100);
      vecY.z = 100 * Perlin(vecY.x / 100, vecY.y / 100, time / 100);
    }
    lineX.geometry.verticesNeedUpdate = true;
    lineY.geometry.verticesNeedUpdate = true;
  }
};

const animate = () => {
  time++;
  updateGrid(time);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

const init = () => {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio = window.devicePixelRatio;
  renderer.setSize(window.innerWidth, window.innerWidth);

  // Container
  const container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  // Camera
  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    3000
  );
  camera.position.z = 200;
  camera.position.x = -100;
  camera.position.y = -100;
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Groups
  groupX = new THREE.Group();
  groupY = new THREE.Group();
  scene.add(groupX);
  scene.add(groupY);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);

  // main

  const material = new THREE.LineBasicMaterial({ color: 0xffffff });

  for (let j = 0; j < size; j++) {
    const geometryX = new THREE.Geometry();
    const geometryY = new THREE.Geometry();
    for (let i = 0; i < size; i++) {
      geometryX.vertices.push(new THREE.Vector3(i * 10, j * 10, 0));
      geometryY.vertices.push(new THREE.Vector3(j * 10, i * 10, 0));
    }
    const meshX = new THREE.Line(geometryX, material);
    const meshY = new THREE.Line(geometryY, material);
    groupX.add(meshX);
    groupY.add(meshY);
  }

  // end of main

  animate();
};

init();
