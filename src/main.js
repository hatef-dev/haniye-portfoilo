import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { GUI } from "lil-gui";
import gsap from "gsap";

/**
 * Loaders
 */
const scene = new THREE.Scene();
const loadingBarElement = document.querySelector(".loading-bar");
let sceneReady = false;
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(overlayMaterial.uniforms.uAlpha, {
        duration: 3,
        value: 0,
        delay: 1,
      });

      // Update loadingBarElement
      loadingBarElement.classList.add("ended");
      loadingBarElement.style.transform = "";
    }, 500);

    window.setTimeout(() => {
      sceneReady = true;
    }, 2000);
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  }
);

const gui = new GUI();
const canvas = document.querySelector("#webgl");

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

let model;

const loader = new GLTFLoader(loadingManager);
loader.load("./models/Test.glb", function (gltf) {
  model = gltf.scene;

  scene.add(model);
});

const debugPointPosition = gui.addFolder("Point Position");




const points = [


    {
        position: window.innerWidth > 768 ? new THREE.Vector3(0, -0.19, -0.35) : new THREE.Vector3(0, -0.19, -0.25),
        element: document.querySelector(".SectionTitle"),
    },
    {
      position: window.innerWidth > 768 ? new THREE.Vector3(0, -0.19, -0.6) : new THREE.Vector3(0, -0.19, -0.65),
      element: document.querySelector(".scrollDownButton"),
    },
    {
      position: new THREE.Vector3(0, 0.15, 0.36) ,
      element: document.querySelector(".wow-icon"),
    }
];


debugPointPosition.add(points[2].position, "y").min(-10).max(10).step(0.01);
debugPointPosition.add(points[2].position, "z").min(-10).max(10).step(0.01);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Responsive camera settings
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);

// Adjust initial camera position based on screen size
camera.position.x = 1.37;
camera.position.y = 0.3;
camera.position.z = -0.15;
camera.rotation.y = Math.PI / 2;
const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x").min(0).max(10).step(0.01);
cameraFolder.add(camera.position, "y").min(0).max(10).step(0.01);
cameraFolder.add(camera.position, "z").min(-20).max(10).step(0.01);
scene.add(camera);

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

const DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionalLight.position.set(1, 1, 1);
scene.add(DirectionalLight);

const lightFolder = gui.addFolder("Light");
lightFolder.add(DirectionalLight, "intensity").min(0).max(10).step(0.01);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.render(scene, camera);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Function to update HTML element positions
function updateElementPositions() {
    if (!sceneReady) return;
    
    for (const point of points) {
        const screenPosition = point.position.clone();
        screenPosition.project(camera);

        // Calculate position relative to viewport
        const translateX = (screenPosition.x + 1) * 0.5 * sizes.width;
        const translateY = (-screenPosition.y * sizes.height) * 0.5;
        
        // Apply transform with proper positioning
        point.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
}

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Update HTML element positions
    updateElementPositions();
    
    renderer.render(scene, camera);
});

function animate() {
  
    
    if (sceneReady) {
        updateElementPositions();
    }
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();

// Handle mouse wheel on desktop
window.addEventListener("wheel", (event) => {
  // Calculate target position
  const targetZ = camera.position.z - event.deltaY * 0.008;
  
  // Animate to the target position
  gsap.to(camera.position, {
    z: targetZ,
    duration: 1,
    ease: "power2.out",
  });
});

let touchStartY = 0;
let touchEndY = 0;

window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientY;
});

window.addEventListener("touchmove", (event) => {
  touchEndY = event.touches[0].clientY;
  const deltaY = touchStartY - touchEndY;
  
  // Calculate target position
  const targetZ = camera.position.z - deltaY * 0.008;
  
  // Animate to the target position
  gsap.to(camera.position, {
    z: targetZ,
    duration: 1,
    ease: "power2.out",
  });
  
  // Update start position for next move
  touchStartY = touchEndY;
});

// Prevent default touch behavior
document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });


