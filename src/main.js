import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "lil-gui";

const gui = new GUI();

const scene = new THREE.Scene();
const canvas = document.querySelector("#webgl");
const loader = new GLTFLoader();

loader.load("./models/1.glb", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.scale.set(2, 2, 2);
});

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2.6, 0.53, -1);
camera.rotation.y = Math.PI / 2;
scene.add(camera);

gui.add(camera.position, "x").min(0).max(10).step(0.01);
gui.add(camera.position, "y").min(0).max(10).step(0.01);
gui.add(camera.position, "z").min(0).max(10).step(0.01);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);


const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);


const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

console.log(renderer);
animate();
