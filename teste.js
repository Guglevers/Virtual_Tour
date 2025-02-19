import * as THREE from 'three';

// Criação da cena e da câmera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // campo de visão
  window.innerWidth / window.innerHeight, // aspecto
  0.1, // plano de corte próximo
  1000 // plano de corte distante
);

// Inicializa o renderer WebGL e configura o tamanho da tela
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding; // Configura a codificação de cor
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Configura o mapeamento tonal
renderer.toneMappingExposure = 0.6; // Configura a exposição do mapeamento tonal
document.body.appendChild(renderer.domElement); // Adiciona o canvas do renderer ao DOM

// Carrega as imagens para usar como texturas
const textureLoader = new THREE.TextureLoader();
const images = ['public/assets/test.jpg', 'public/assets/a.jpg', 'public/assets/vlw-mw-potw.jpg', 'public/assets/armazones-sunset360.jpg'];
let currentImageIndex = 0; // Índice da imagem atual

// Cria uma esfera para a textura
const geometry = new THREE.SphereGeometry(500, 60, 40);
geometry.scale(-1, 1, 1); // Inverte a escala para o lado de dentro da esfera
const material = new THREE.MeshBasicMaterial(); // Material sem iluminação
const sphere = new THREE.Mesh(geometry, material); // Mesh da esfera
scene.add(sphere); // Adiciona a esfera à cena

// Função para carregar a textura
function loadTexture(index) {
  textureLoader.load(images[index], (texture) => {
    texture.encoding = THREE.sRGBEncoding; // Configura a codificação da textura
    material.map = texture; // Aplica a textura ao material
    material.needsUpdate = true; // Atualiza o material
  });
}

// Carrega a textura inicial
loadTexture(currentImageIndex);

// Configura a câmera
camera.position.set(0, 0, 0); // Posição inicial da câmera
camera.rotation.order = 'YXZ'; // Ordem de rotação da câmera
camera.up.set(0, 1, 0); // Configura o vetor "up" da câmera

// Adiciona uma luz ambiente à cena
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz suave de intensidade 0.5
scene.add(ambientLight);

// Cria um sprite com um ícone (imagem de info)
const spriteMaterial = new THREE.SpriteMaterial({
  map: textureLoader.load('public/assets/info-icon.png'),
  sizeAttenuation: true
});
const icon = new THREE.Sprite(spriteMaterial);
icon.position.set(0, -50, 400); // Posição do ícone
icon.scale.set(50, 50, 1); // Escala do ícone
scene.add(icon); // Adiciona o ícone à cena

// Configura o raycaster para detectar interações com o ícone
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variáveis de controle para interação de arrastar e clicar
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let mouseDownPosition = { x: 0, y: 0 };
const dragThreshold = 5; // Distância mínima para considerar um clique

// Eventos de mouse
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
  const distance = Math.sqrt(dx * dx + dy * dy); // Distância do movimento do mouse
  isDragging = false;
  if (distance < dragThreshold) { // Se o movimento for pequeno, tenta clicar no ícone
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera); // Configura o raycaster com a posição do mouse
    const intersects = raycaster.intersectObject(icon); // Verifica se o mouse está sobre o ícone
    if (intersects.length > 0) {
      currentImageIndex = (currentImageIndex + 1) % images.length; // Altera a imagem ao clicar
      loadTexture(currentImageIndex); // Carrega a próxima imagem
    }
  }
});

window.addEventListener('mousemove', (event) => {
  if (isDragging) { // Se o mouse estiver sendo arrastado
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    let yaw = camera.rotation.y;
    let pitch = camera.rotation.x;
    yaw -= deltaX * 0.005; // Ajusta a rotação em torno do eixo Y
    pitch -= deltaY * 0.005; // Ajusta a rotação em torno do eixo X
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Limita a rotação para evitar inversões
    camera.rotation.set(pitch, yaw, 0); // Atualiza a rotação da câmera
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
  }
});

// Função de animação principal
function animate() {
  requestAnimationFrame(animate); // Chama a função recursivamente
  renderer.render(scene, camera); // Renderiza a cena
}

animate(); // Inicia a animação
