import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { GUI } from 'lil-gui';
import gsap from 'gsap';

const scene = new THREE.Scene();

const gui = new GUI();
const canvas = document.querySelector('canvas');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000);
camera.position.x = 1.24;
camera.position.y = 0.3;
camera.position.z = -0.15;
camera.rotation.y = Math.PI / 2;
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x').min(0).max(10).step(0.01);
cameraFolder.add(camera.position, 'y').min(0).max(10).step(0.01);
cameraFolder.add(camera.position, 'z').min(-20).max(10).step(0.01);

// cameraFolder.add(camera.rotation, 'z').min(0).max(100).step(0.01);

// camera.rotation.x = -Math.PI / 2;
scene.add(camera);

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

const loader = new GLTFLoader();
loader.load('./models/Test.glb', function(gltf) {
    const model = gltf.scene;
    scene.add(model);
});

const planeGeometry = new THREE.PlaneGeometry(0.5, 0.5)
const planeMaterial = new THREE.MeshBasicMaterial({ color: "red"})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)

const point = [
    {
        position: new THREE.Vector3()
    }
]



const DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionalLight.position.set(1, 1, 1);
scene.add(DirectionalLight);

const lightFolder = gui.addFolder('Light');
lightFolder.add(DirectionalLight, 'intensity').min(0).max(10).step(0.01);


const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas'),
    antialias: true,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

const clock = new THREE.Clock();
function animate() {
    const elapsedTime = clock.getElapsedTime();
    // controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();

window.addEventListener('wheel', (event) => {
    camera.position.z -= event.deltaY * 0.001;
    console.log(camera.position.z);
});