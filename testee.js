import * as THREE from 'three';

// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.6;
document.body.appendChild(renderer.domElement);

// Load the panorama texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('public/assets/teste.jpg', () => {
    texture.encoding = THREE.sRGBEncoding;
    animate();
});

// Create the full sphere
const geometry = new THREE.SphereGeometry(500, 60, 40);
geometry.scale(-1, 1, 1);
const material = new THREE.MeshBasicMaterial({
    map: texture,
    toneMapped: true
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// --- Option 4: Add Black Caps ---
// Create a cap geometry (a circle) and a basic black material.
const capGeometry = new THREE.CircleGeometry(100, 32);
const capMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

// Top cap: adjust the position (Y value) as needed
const topCap = new THREE.Mesh(capGeometry, capMaterial);
topCap.position.set(0, 495, 0);
topCap.rotation.x = -Math.PI / 2;
scene.add(topCap);

// Bottom cap
const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
bottomCap.position.set(0, -495, 0);
bottomCap.rotation.x = Math.PI / 2;
scene.add(bottomCap);

// Camera and ambient light
camera.position.set(0, 0, 0);
camera.rotation.order = 'YXZ';
camera.up.set(0, 1, 0);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add Mark Points and interaction (same as before)
const spriteMaterial = new THREE.SpriteMaterial({
    map: textureLoader.load('public/assets/info-icon.png'),
    sizeAttenuation: true
});
const markPoints = [
    { position: new THREE.Vector3(100, 50, -200), info: "Art Piece 1: Description goes here." },
    { position: new THREE.Vector3(-150, 20, 300), info: "Integrantes do grupo: Arthur, Gustavo, Caio, Danilo, Kaua" }
];
const sprites = [];
markPoints.forEach((mark) => {
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(mark.position);
    sprite.scale.set(50, 50, 1);
    scene.add(sprite);
    sprites.push({ sprite, info: mark.info });
});
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let mouseDownPosition = { x: 0, y: 0 };
const dragThreshold = 5;
window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
    mouseDownPosition.x = event.clientX;
    mouseDownPosition.y = event.clientY;
});
window.addEventListener('mouseup', (event) => {
    const dx = event.clientX - mouseDownPosition.x;
    const dy = event.clientY - mouseDownPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    isDragging = false;
    if (distance < dragThreshold) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(sprites.map(s => s.sprite));
        if (intersects.length > 0) {
            const selected = sprites.find(s => s.sprite === intersects[0].object);
            if (selected) {
                showModal(selected.info);
            }
        }
    }
});
window.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        let yaw = camera.rotation.y;
        let pitch = camera.rotation.x;
        yaw -= deltaX * 0.005;
        pitch -= deltaY * 0.005;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        camera.rotation.set(pitch, yaw, 0);
        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
    }
});
function showModal(info) {
    const modal = document.createElement('div');
    modal.style.position = 'absolute';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'rgba(0, 0, 0, 0.8)';
    modal.style.color = 'white';
    modal.style.padding = '20px';
    modal.style.borderRadius = '10px';
    modal.style.zIndex = '1000';
    modal.style.fontSize = '32px';
    modal.innerHTML = `
        <p>${info}</p>
        <button id="close-modal" style="margin-top: 10px;">Close</button>
    `;
    document.body.appendChild(modal);
    document.getElementById('close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
