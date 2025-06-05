import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { GUI } from "lil-gui";
import gsap from "gsap";

/**
 * Loaders
 */
const gui = new GUI();
const scene = new THREE.Scene();
const loadingBarElement = document.querySelector(".loading-bar");
const container = document.querySelector(".container");
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
      container.style.opacity =1;
    }, 1500);
  },
  
  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
    container.style.opacity =0;
  }
);
// loaders
const loader = new GLTFLoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);


const canvas = document.querySelector("#webgl");

/**
 * Textures Plane
 */
const planeGeometry = new THREE.PlaneGeometry(0.5, 0.5);
const planeMaterial1 = new THREE.MeshBasicMaterial({
  color: "red",
  
});
const planeMaterial2 = new THREE.MeshBasicMaterial({
  color: "blue",
  
});

const planeMaterial3 = new THREE.MeshBasicMaterial({
  color: "green",
  
});

const plane1 = new THREE.Mesh(planeGeometry, planeMaterial1);
plane1.rotation.y = Math.PI / 2;
plane1.position.set(0.03, 0.27, -3.24);
plane1.scale.set(0.77, 0.58, 1);

const plane2 = new THREE.Mesh(planeGeometry, planeMaterial2);
plane2.rotation.y = Math.PI / 2;
plane2.position.set(0.03, 0.27, -3.98);
plane2.scale.set(0.77, 0.58, 0.58);

const plane3 = new THREE.Mesh(planeGeometry, planeMaterial3);
plane3.rotation.y = Math.PI / 2;
plane3.position.set(0.03, 0.27, -4.73);
plane3.scale.set(0.77, 0.58, 0.58);

scene.add(plane1);
scene.add(plane2);
scene.add(plane3);
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

let earth;
loader.load("./models/Test.glb", function (gltf) {
  model = gltf.scene;
  model.traverse((child) => {
    if(child instanceof THREE.Mesh){
      if(child.name === "pSphere1"){
        earth = child;
      }
    }
  });
  scene.add(model);
});



/* point position */
const debugPointPosition = gui.addFolder("Point Position");
const points = [


    {
        position: window.innerWidth > 768 ? new THREE.Vector3(0, -0.19, -0.35) : new THREE.Vector3(0, -0.37, -0.31),
        element: document.querySelector(".SectionTitle"),
    },
    {
      position: window.innerWidth > 768 ? new THREE.Vector3(0, -0.19, -0.6) : new THREE.Vector3(0, -0.37, -0.6),
      element: document.querySelector(".scrollDownButton"),
    },
    {
      position: window.innerWidth > 768 ? new THREE.Vector3(0, 0.15, 0.36) : new THREE.Vector3(0, -0.04, 0.26) ,
      element: document.querySelector(".wow-icon"),
    },
    {
      position: window.innerWidth > 768 ? new THREE.Vector3(0, -0.3, -0.35) : new THREE.Vector3(0, -0.49, -0.3) ,
      element: document.querySelector(".buttonContainer"),
    },
    {
      position: window.innerWidth > 768 ? new THREE.Vector3(0, 0.13, -1.82) : new THREE.Vector3(0, -0.04, -1.82) ,
      element: document.querySelector(".helloIcon"),
    },
    {
      position: window.innerWidth > 768 ? new THREE.Vector3(0, 0.03, -1.58) : new THREE.Vector3(0, -0.14, -1.58) ,
      element: document.querySelector(".WhoAmI"),
    },
    {
      position: window.innerWidth > 768 ? new THREE.Vector3(0, 0, -3.46) : new THREE.Vector3(0, -0.19, -3.46) ,
      element: document.querySelector(".work1"),
    },
    {
      position: window.innerWidth > 768 ? new THREE.Vector3(0, 0, -4.21) : new THREE.Vector3(0, -0.19, -4.21) ,
      element: document.querySelector(".work2"),
    },
    {
      position: window.innerWidth > 768 ? new THREE.Vector3(0, 0, -4.96) : new THREE.Vector3(0, -0.19, -4.96) ,
      element: document.querySelector(".work3"),
    },
    

];


debugPointPosition.add(points[6].position, "y").min(-10).max(10).step(0.01);
debugPointPosition.add(points[6].position, "z").min(-10).max(10).step(0.01);

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
if(window.innerWidth > 768){
  camera.position.x = 1.37;
}else{
  camera.position.x = 2;
}
camera.position.y = 0.3;
camera.position.z = -0.15;
camera.rotation.y = Math.PI / 2;
const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x").min(0).max(10).step(0.01);
cameraFolder.add(camera.position, "y").min(0).max(10).step(0.01);
cameraFolder.add(camera.position, "z").min(-20).max(10).step(0.01);
scene.add(camera);



const parameters = {
  hemisphereLight: {
    intensity: 5.5,
    color1: 0xffffff,
    color2: 0x575757,
  },
};


/* hemisphere light */
const hemisphereLight = new THREE.HemisphereLight(parameters.hemisphereLight.color1, parameters.hemisphereLight.color2, parameters.hemisphereLight.intensity);
scene.add(hemisphereLight);

gui.add(hemisphereLight, "intensity").min(0).max(10).step(0.01);
gui.addColor(parameters.hemisphereLight, "color1").onChange((value) => {
  hemisphereLight.color.set(value);
});
gui.addColor(parameters.hemisphereLight, "color2").onChange((value) => {
  hemisphereLight.groundColor.set(value);
});


/* renderer */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.render(scene, camera);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



// Function to update HTML element positions
function updatePointsPositions() {
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

/* resize */
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
    updatePointsPositions();
    
    renderer.render(scene, camera);
});

/* animate */
const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();
    if(earth){
      earth.rotation.z = elapsedTime * 0.5;
    }
    if (sceneReady) {
        updatePointsPositions();
    }
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();


function updateElementPositions() {
  renderer.render(scene, camera);
  updatePointsPositions();
}

let isScrolling = false;

window.addEventListener("wheel", (event) => {
  if (isScrolling) return; // جلوی اجرای چندباره رو می‌گیریم
  isScrolling = true;

  const targetZ = camera.position.z - event.deltaY * 0.02;
  if (targetZ < -8.62 || targetZ > 1) {
    isScrolling = false;
    return;
  }

  gsap.to(camera.position, {
    z: targetZ,
    duration: 1,
    ease: "sine.out",
    onUpdate: () => {
      updateElementPositions();
    },
    onComplete: () => {
      isScrolling = false; // دوباره اجازه اسکرول می‌ده
    }
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

  const targetZ = camera.position.z - deltaY * 0.02;
  if (targetZ < -8.62 || targetZ > 1) return;

  gsap.killTweensOf(camera.position); // جلوگیری از انیمیشن‌های تکراری

  gsap.to(camera.position, {
    z: targetZ,
    duration: 1,
    ease: "sine.out",
    onUpdate: () => {
      updateElementPositions();
    }
  });

  // برای اینکه حرکت بعدی درست محاسبه بشه
  touchStartY = touchEndY;
});

document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });