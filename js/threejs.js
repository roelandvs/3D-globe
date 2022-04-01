import * as THREE from "./threejs/three.module.js";
import { OrbitControls } from "./threejs/OrbitControls.js";
// import { GLTFLoader } from "./threejs/GLTFLoader.js";
// import * as dat from "dat.gui";

// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = null;

// Object
const globe = new THREE.SphereBufferGeometry(0.015, 64, 64);

// Materials
const material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture("../Earth_Diffuse_6K.jpg"),
    transparent: true,
});

// Mesh
const sphere = new THREE.Mesh(globe, material);
scene.add(sphere);

// Lights
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

/**
 * Sizes
 */
const sizes = {
    width: window.innerHeight,
    height: window.innerHeight,
};

// window.addEventListener("resize", () => {
//     // Update sizes
//     sizes.width = window.innerHeight;
//     sizes.height = window.innerHeight;

//     // Update camera
//     camera.aspect = 1;
//     camera.updateProjectionMatrix();

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    1,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 0);

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.update();

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    // sphere.rotation.y = 0.2 * elapsedTime;

    // Update Orbital Controls
    // controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);

    //Update controls
    controls.update();
};

tick();
