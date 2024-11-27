import * as THREE from 'three';

// cena, camera and Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Carregue a imagem equiretangular como uma textura.
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('public/assets/panorama.jpg', () => {
    animate(); // Inicie a renderização após o carregamento da textura.
});

// Inverta a esfera para torná-la visível de dentro.
const geometry = new THREE.SphereGeometry(500, 60, 40);
geometry.scale(-1, 1, 1); // 

// Aplique a textura ao material da esfera.
const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Posicao da camera
camera.position.set(0, 0, 0);

// Variáveis para controle do mouse.
let isDragging = false; // Se o mouse está sendo arrastado.
let previousMousePosition = { x: 0, y: 0 };

// Ouvintes de eventos do mouse.
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
        // Calcule a mudança na posição do mouse.
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        // Ajuste a rotação da câmera com base no movimento do mouse.
        camera.rotation.y -= deltaX * 0.005; // Horizontal rotation (Y-axis)
        camera.rotation.x -= deltaY * 0.005; // Vertical rotation (X-axis)

        // Limite a rotação vertical para evitar a inversão.
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

        // Atualize a posição anterior do mouse.
        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
    }
});

// Loop de animação.
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}