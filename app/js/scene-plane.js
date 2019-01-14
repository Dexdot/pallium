import * as THREE from 'three';
import Perlin from './perlin';
const OrbitControls = require('three-orbit-controls')(THREE);

let camera,
  controls,
  scene,
  renderer,
  mesh,
  geometry,
  time = 0;

const size = 40;

const updatePlane = time => {
  for (let i = 0; i < geometry.vertices.length; i++) {
    let vec = geometry.vertices[i];
    vec.z = 100 * Perlin(vec.x / 100, vec.y / 100, time / 100);
  }
  geometry.verticesNeedUpdate = true;
};

const animate = () => {
  time++;
  updatePlane(time);
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
  camera.position.z = 100;
  camera.position.x = -100;
  camera.position.y = -100;
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);

  // main

  const material = new THREE.ShaderMaterial({
    // wireframe: true,
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable'
    },
    uniforms: {
      time: { type: 'f', value: 0.0 }
    },
    vertexShader: document.getElementById('vertShader').textContent,
    fragmentShader: document.getElementById('fragShader').textContent,
    side: THREE.DoubleSide,
    transparent: true
  });

  geometry = new THREE.PlaneGeometry(600, 600, size, size);
  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // end of main

  animate();
};

init();
