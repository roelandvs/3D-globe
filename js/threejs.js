import * as THREE from "./threejs/three.module.js";
import { OrbitControls } from "./threejs/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = null;

// Object
const globe = new THREE.SphereBufferGeometry(0.015, 64, 64);
const bigCircle = new THREE.CircleGeometry(0.001, 32);
const smallCircle = new THREE.CircleGeometry(0.0002, 32);
globe.rotateY(5.2);
globe.rotateX(0.2);

// Materials
const material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture("../img/blue-world.png"),
    transparent: true,
});
const blueMaterial = new THREE.MeshBasicMaterial({ color: 0x01cbe1 });
const greenMaterial = new THREE.MeshBasicMaterial({ color: 0xc7e44f });

// Mesh
const sphere = new THREE.Mesh(globe, material);
const atlanticPatch = new THREE.Mesh(bigCircle, blueMaterial);
const otherPatch = new THREE.Mesh(bigCircle, blueMaterial);
const riverItem = new THREE.Mesh(smallCircle, greenMaterial);

atlanticPatch.position.set(-0.003, 0.005, 0.015);
otherPatch.position.set(0.003, -0.01, 0.012);
riverItem.position.set(0.008, 0, 0.013);

sphere.add(atlanticPatch);
sphere.add(otherPatch);
sphere.add(riverItem);

scene.add(sphere);

// Lights
const light = new THREE.AmbientLight(0xffffff, 1.1);
scene.add(light);

/**
 * Sizes
 */
const sizes = {
    width: window.innerHeight,
    height: window.innerHeight,
};

/**
 * Camera
 */
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
controls.rotateSpeed = 0.4;
controls.update();

canvas.style.width = "100%";
canvas.style.height = "auto";

/**
 * Animate
 */
const tick = () => {
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);

    //Update controls
    controls.update();

    atlanticPatch.lookAt(camera.position);
    otherPatch.lookAt(camera.position);
    riverItem.lookAt(camera.position);
};

tick();
