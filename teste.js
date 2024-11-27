import * as THREE from 'three';

// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the equirectangular image as a texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('public/assets/panorama.jpg', () => {
    animate(); // Start rendering after the texture loads
});

// Create a sphere geometry for the environment
const geometry = new THREE.SphereGeometry(500, 60, 40);
geometry.scale(-1, 1, 1); // Invert the sphere to make it viewable from inside

// Apply the texture to the sphere material
const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Camera position
camera.position.set(0, 0, 0);

// Variables for mouse control
let isDragging = false; // Whether the mouse is being dragged
let previousMousePosition = { x: 0, y: 0 };

// Mouse event listeners
window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('mousemove', (event) => {
    if (isDragging) {
        // Calculate the change in mouse position
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        // Adjust camera rotation based on mouse movement
        camera.rotation.y -= deltaX * 0.005; // Horizontal rotation (Y-axis)
        camera.rotation.x -= deltaY * 0.005; // Vertical rotation (X-axis)

        // Clamp the vertical rotation to avoid flipping
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

        // Update the previous mouse position
        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
