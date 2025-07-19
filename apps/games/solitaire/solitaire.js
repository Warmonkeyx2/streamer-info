// solitaire.js

document.addEventListener('DOMContentLoaded', () => {
  const suits = ['♠', '♥', '♣', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck = [];

  function createDeck() {
    deck = [];
    suits.forEach(suit => {
      values.forEach(value => {
        deck.push({
          suit,
          value,
          color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
        });
      });
    });
  }

  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function renderInitialLayout() {
    const board = document.createElement('div');
    board.className = 'solitaire-board';

    // Background layer
    const bg = document.createElement('div');
    bg.className = 'solitaire-background';
    document.getElementById('solitaire-root').appendChild(bg);

    // Header
    const header = document.createElement('div');
    header.className = 'solitaire-header';
    header.innerHTML = `<h2>Solitaire</h2> <button onclick="restartSolitaire()">Restart</button>`;

    // Top Row with piles
    const topRow = document.createElement('div');
    topRow.className = 'top-row';
    const stock = document.createElement('div');
    stock.className = 'card-slot';
    stock.id = 'stock';
    stock.innerText = '🂠';

    const foundationGroup = document.createElement('div');
    foundationGroup.className = 'foundation-group';
    for (let i = 0; i < 4; i++) {
      const pile = document.createElement('div');
      pile.className = 'pile';
      foundationGroup.appendChild(pile);
    }

    topRow.appendChild(stock);
    topRow.appendChild(foundationGroup);

    // Tableau Rows
    const tableau = document.createElement('div');
    tableau.className = 'tableau';
    for (let i = 0; i < 7; i++) {
      const column = document.createElement('div');
      column.className = 'card-slot';
      column.id = `tableau-${i}`;
      tableau.appendChild(column);
    }

    board.appendChild(header);
    board.appendChild(topRow);
    board.appendChild(tableau);

    const root = document.getElementById('solitaire-root');
    root.innerHTML = ''; // Clear first
    root.appendChild(board);

    dealCards();
  }

  function dealCards() {
    let cardIndex = 0;
    for (let i = 0; i < 7; i++) {
      const column = document.getElementById(`tableau-${i}`);
      for (let j = 0; j <= i; j++) {
        const card = createCardElement(deck[cardIndex++], j === i); // last card face up
        column.appendChild(card);
      }
    }
  }

  function createCardElement(cardData, faceUp = false) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerText = faceUp ? `${cardData.value}${cardData.suit}` : '';
    card.style.backgroundColor = faceUp ? (cardData.color === 'red' ? '#922' : '#222') : '#000';
    card.dataset.value = cardData.value;
    card.dataset.suit = cardData.suit;
    card.dataset.faceUp = faceUp;
    return card;
  }
// === Drag and Drop Logic ===

let draggedCard = null;

document.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('card') && e.target.dataset.faceUp === 'true') {
    draggedCard = e.target;
    draggedCard.style.position = 'absolute';
    draggedCard.style.zIndex = 1000;
    moveCardWithMouse(e);
    document.body.appendChild(draggedCard);
  }
});

document.addEventListener('mousemove', (e) => {
  if (draggedCard) {
    moveCardWithMouse(e);
  }
});

document.addEventListener('mouseup', (e) => {
  if (!draggedCard) return;

  const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
  const dropTarget = elementsAtPoint.find(el => el.classList.contains('card-slot') || el.classList.contains('pile'));

  if (dropTarget && dropTarget.classList.contains('card-slot') && dropTarget.childElementCount === 0) {
    dropTarget.appendChild(draggedCard);
    draggedCard.style.position = 'relative';
    draggedCard.style.zIndex = 1;
    draggedCard.style.left = '';
    draggedCard.style.top = '';
  } else {
    // Return to previous position
    draggedCard.remove();
  }

  draggedCard = null;
});

function moveCardWithMouse(e) {
  if (!draggedCard) return;
  draggedCard.style.left = `${e.pageX - 40}px`;
  draggedCard.style.top = `${e.pageY - 60}px`;
}


  // Restart
  window.restartSolitaire = () => {
    createDeck();
    shuffleDeck();
    renderInitialLayout();
  };

  // Start game
  restartSolitaire();
});
