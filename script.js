// Importa a biblioteca Three.js
import * as THREE from 'three';

// Criação da cena onde serão adicionados todos os objetos 3D
const scene = new THREE.Scene();

// Criação da câmera com parâmetros: campo de visão (75 graus), aspecto (largura/altura), plano de corte próximo e distante
const camera = new THREE.PerspectiveCamera(
  75, // campo de visão
  window.innerWidth / window.innerHeight, // aspecto
  0.1, // plano de corte próximo
  1000 // plano de corte distante
);

// Criação do renderizador que exibirá a cena em um elemento canvas
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// Configurações de codificação e mapeamento de tom para melhor qualidade visual
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.6;
// Adiciona o canvas criado ao corpo (body) do documento HTML
document.body.appendChild(renderer.domElement);

// Cria um carregador de texturas para importar as imagens
const textureLoader = new THREE.TextureLoader();

// Array com as imagens utilizadas no tour virtual
// Para adicionar novas imagens, basta inserir o caminho da imagem neste array
const images = [
  'public/assets/test.jpg', 
  'public/assets/milkway.jpg', 
  'public/assets/vlw-mw-potw.jpg', 
  'public/assets/armazones-sunset360.jpg'
];
let currentImageIndex = 0; // Índice que indica qual imagem está atualmente sendo exibida

// Cria a geometria de uma esfera para mapear a imagem panorâmica
const geometry = new THREE.SphereGeometry(500, 60, 40);
// Inverte a escala da esfera para que a textura seja exibida por dentro dela
geometry.scale(-1, 1, 1);

// Cria um material básico que receberá a textura
const material = new THREE.MeshBasicMaterial();

// Cria a malha (mesh) da esfera e a adiciona à cena
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Função para carregar uma textura (imagem) baseada no índice fornecido
// Aqui você pode modificar ou ampliar a navegação entre imagens, adicionando novos comportamentos
function loadTexture(index) {
  textureLoader.load(images[index], (texture) => {
    texture.encoding = THREE.sRGBEncoding; // Configura a codificação da textura
    material.map = texture; // Aplica a textura ao material
    material.needsUpdate = true; // Atualiza o material
  });
}

// Carrega a primeira imagem ao iniciar o projeto
loadTexture(currentImageIndex);

// Configura a posição e os parâmetros da câmera
camera.position.set(0, 0, 0);
camera.rotation.order = 'YXZ';
camera.up.set(0, 1, 0);

// Adiciona uma luz ambiente para melhorar a visualização (mesmo não sendo fundamental para MeshBasicMaterial)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Cria um material para um sprite (ícone informativo) que permite interação com o usuário
const spriteMaterial = new THREE.SpriteMaterial({
  map: textureLoader.load('public/assets/info-icon.png'),
  sizeAttenuation: true
});

// Cria o sprite (ícone) e define sua posição e escala
const icon = new THREE.Sprite(spriteMaterial);
icon.position.set(0, -50, 400); // Posição do ícone
icon.scale.set(50, 50, 1); // Escala do ícone
scene.add(icon); // Adiciona o ícone à cena

// Criação do raycaster e de um vetor para detectar a posição do mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variáveis de controle para o arrasto (drag) do mouse
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let mouseDownPosition = { x: 0, y: 0 };
const dragThreshold = 5; // Limite de movimentação para diferenciar clique de arrasto

// Evento para quando o botão do mouse é pressionado
window.addEventListener('mousedown', (event) => {
  isDragging = true;
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
  mouseDownPosition.x = event.clientX;
  mouseDownPosition.y = event.clientY;
});

// Evento para quando o botão do mouse é solto
window.addEventListener('mouseup', (event) => {
  // Calcula a distância percorrida com o mouse para diferenciar entre um clique e um arrasto
  const dx = event.clientX - mouseDownPosition.x;
  const dy = event.clientY - mouseDownPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy); // Distância do movimento do mouse
  isDragging = false;
  
  // Se o movimento foi menor que o limiar definido, considera como um clique
  if (distance < dragThreshold) {
    // Converte as coordenadas do clique para o sistema de coordenadas normalizadas do Three.js
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    // Verifica se o clique atingiu o sprite (ícone)
    const intersects = raycaster.intersectObject(icon);
    if (intersects.length > 0) {
      // Ao clicar no ícone, avança para a próxima imagem
      currentImageIndex = (currentImageIndex + 1) % images.length;
      loadTexture(currentImageIndex);
      
      // Caso deseje implementar outra funcionalidade de navegação,
      // adicione aqui o código para, por exemplo, retroceder a imagem ou abrir um menu.
    }
  }
});

// Evento para detectar o movimento do mouse e atualizar a rotação da câmera
window.addEventListener('mousemove', (event) => {
  if (isDragging) { // Se o mouse estiver sendo arrastado
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    let yaw = camera.rotation.y;
    let pitch = camera.rotation.x;
    // Atualiza os ângulos com base no movimento do mouse (multiplicador de 0.005 para suavizar)
    yaw -= deltaX * 0.005;
    pitch -= deltaY * 0.005;
    // Limita o ângulo de pitch para evitar que a câmera inverta
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    camera.rotation.set(pitch, yaw, 0);
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
  }
});

// Função de animação que atualiza a cena e renderiza a cada frame
function animate() {
  requestAnimationFrame(animate); // Chama a função recursivamente
  renderer.render(scene, camera); // Renderiza a cena
}

// Inicia a animação
animate();
