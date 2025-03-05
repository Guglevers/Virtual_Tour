# Tour Virtual

Este projeto utiliza [Three.js](https://threejs.org/) para criar uma experiência de tour virtual em 360°. As imagens panorâmicas são mapeadas em uma esfera, permitindo que o usuário navegue pelo ambiente de forma interativa. O projeto foi desenvolvido com foco em facilitar a continuidade e a evolução por futuras equipes.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Modificações e Customizações](#modificações-e-customizações)
- [Melhorias Sugeridas](#melhorias-sugeridas)
- [Recursos Adicionais](#recursos-adicionais)

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado a versão LTS)
- [Git](https://git-scm.com/)

## Instalação e Execução

1. **Fork do Repositório:**

   - Acesse o repositório no GitHub: [Repositório do Tour Virtual](https://github.com/Guglevers/Virtual_Tour)
   - Clique no botão **Fork** (canto superior direito) para criar uma cópia na sua conta.

2. **Clone o Repositório:**

   Abra o terminal e execute:
   ```bash
   git clone https://github.com/seu_usuario/Virtual_Tour.git
Substitua seu_usuario pelo seu nome de usuário do GitHub.

Instale as Dependências:

No diretório do projeto, execute:

bash
Copiar
npm install
Rode o Projeto Localmente:

Para iniciar o projeto com Vite, execute:

bash
Copiar
npx vite
Em seguida, abra o navegador e acesse o endereço exibido no terminal (geralmente http://localhost:5173).

Estrutura do Projeto
/public/assets/: Contém as imagens utilizadas (ex.: panorâmicas e ícone informativo).
Código Principal:
main.js (ou similar): Arquivo onde está implementada a lógica com Three.js.
Dentro do código, é utilizado um array chamado images que armazena os caminhos das imagens para o tour virtual.
Modificações e Customizações
Adicionar Novas Imagens:

Localize o array images no código:
javascript
Copiar
const images = [
  'public/assets/test.jpg', 
  'public/assets/milkway.jpg', 
  'public/assets/vlw-mw-potw.jpg', 
  'public/assets/armazones-sunset360.jpg'
];
Insira o caminho da nova imagem no array. Por exemplo:
javascript
Copiar
'public/assets/nova-imagem.jpg'
Navegação entre Imagens:

Atualmente, a troca de imagens é acionada pelo clique no ícone (sprite). Para modificar ou adicionar novas formas de navegação, procure pelo trecho que manipula o evento mouseup e o raycaster:
javascript
Copiar
if (intersects.length > 0) {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  loadTexture(currentImageIndex);
}
Você pode adicionar botões HTML e associar eventos de clique para avançar ou retroceder as imagens, modificando a variável currentImageIndex e chamando a função loadTexture.
Interação com a Câmera (Navegação pelo Mouse):

A rotação da câmera é controlada pelo evento mousemove quando o mouse está sendo arrastado. As variáveis yaw e pitch são atualizadas conforme o movimento:
javascript
Copiar
yaw -= deltaX * 0.005;
pitch -= deltaY * 0.005;
Para ajustar a sensibilidade do movimento ou tornar o scroll mais suave, você pode alterar o multiplicador (neste caso, 0.005). Teste diferentes valores para obter a experiência desejada.
Melhorias Sugeridas
Scroll Suave:
Implementar uma função que interpole suavemente a rotação da câmera ao invés de atualizações abruptas. Uma abordagem seria utilizar animações com requestAnimationFrame para suavizar os movimentos.

Controles Adicionais:
Adicionar botões de navegação (por exemplo, "próximo" e "anterior") na interface, facilitando a troca de imagens sem depender somente do clique no ícone.

Interface Responsiva:
Adaptar a interface para dispositivos móveis, garantindo que os controles de navegação sejam acessíveis em telas menores.

Otimização de Performance:
Verificar o carregamento de texturas e possíveis melhorias na renderização para que a experiência seja fluida mesmo em dispositivos com hardware mais modesto.
