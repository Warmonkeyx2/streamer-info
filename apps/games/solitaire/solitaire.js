

// solitaire.js
function startSolitaireGame() {
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

  function createCardElement(cardData, faceUp = false) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerText = faceUp ? `${cardData.value}${cardData.suit}` : '';
    card.style.backgroundColor = faceUp ? (cardData.color === 'red' ? '#922' : '#222') : '#000';
    card.dataset.value = cardData.value;
    card.dataset.suit = cardData.suit;
    card.dataset.faceUp = faceUp;

    card.draggable = true;
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(cardData));
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    return card;
  }

  function renderInitialLayout() {
    const board = document.createElement('div');
    board.className = 'solitaire-board';

    const bg = document.createElement('div');
    bg.className = 'solitaire-background';
    document.getElementById('solitaire-root').appendChild(bg);

    const header = document.createElement('div');
    header.className = 'solitaire-header';
    header.innerHTML = `<h2>Solitaire</h2> <button onclick="restartSolitaire()">Restart</button>`;

    const topRow = document.createElement('div');
    topRow.className = 'top-row';

    const stock = document.createElement('div');
    stock.className = 'card-slot';
    stock.id = 'stock';
    stock.innerText = '🂠';
    stock.addEventListener('click', drawFromStock);

    const foundationGroup = document.createElement('div');
    foundationGroup.className = 'foundation-group';
    for (let i = 0; i < 4; i++) {
      const pile = document.createElement('div');
      pile.className = 'pile';
      foundationGroup.appendChild(pile);
    }

    topRow.appendChild(stock);
    topRow.appendChild(foundationGroup);

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
    root.innerHTML = '';
    root.appendChild(board);

    dealCards();

    // Rebind drop zones AFTER cards exist
    document.querySelectorAll('.card-slot, .pile').forEach(slot => {
      slot.addEventListener('dragover', e => e.preventDefault());
      slot.addEventListener('drop', e => {
        e.preventDefault();
        const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const card = createCardElement(cardData, true);
        slot.appendChild(card);
      });
    });
  }

  function dealCards() {
    let cardIndex = 0;
    for (let i = 0; i < 7; i++) {
      const column = document.getElementById(`tableau-${i}`);
      for (let j = 0; j <= i; j++) {
        const card = createCardElement(deck[cardIndex++], j === i);
        column.appendChild(card);
      }
    }
  }

  function drawFromStock() {
    if (!deck.length) return;
    const cardData = deck.pop();
    const card = createCardElement(cardData, true);
    const foundationGroup = document.querySelector('.foundation-group');
    const lastPile = foundationGroup.lastElementChild;
    lastPile.appendChild(card);
  }

  window.restartSolitaire = () => {
    createDeck();
    shuffleDeck();
    renderInitialLayout();
  };

  // Call only once loaded by wrapper
  restartSolitaire();
}
