```js
function startSolitaireGame() {
  const suits = ['♠', '♥', '♣', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck = [];

  const createDeck = () => {
    deck = suits.flatMap(suit => 
      values.map(value => ({
        suit,
        value,
        color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
      }))
    );
  };

  const shuffleDeck = () => {
    deck = deck.sort(() => Math.random() - 0.5);
  };

  const createCardElement = ({ suit, value, color }, faceUp = false) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = faceUp ? `${value}${suit}` : '';
    card.style.backgroundColor = faceUp ? (color === 'red' ? '#922' : '#222') : '#000';
    card.dataset.value = value;
    card.dataset.suit = suit;
    card.dataset.faceUp = faceUp;
    card.draggable = true;

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('application/json', JSON.stringify({ suit, value, color }));
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    return card;
  };

  const renderInitialLayout = () => {
    const root = document.getElementById('solitaire-root');
    root.innerHTML = ''; // Clear previous contents

    const board = document.createElement('div');
    board.className = 'solitaire-board';

    const header = document.createElement('div');
    header.className = 'solitaire-header';
    header.innerHTML = '<h2>Solitaire</h2><button id="restart-button">Restart</button>';

    const createSlot = (id = '') => {
      const slot = document.createElement('div');
      slot.className = 'card-slot';
      if (id) slot.id = id;
      return slot;
    };

    const stock = createSlot('stock');
    stock.textContent = '🂠';
    stock.addEventListener('click', drawFromStock);

    const foundationGroup = document.createElement('div');
    foundationGroup.className = 'foundation-group';
    Array.from({ length: 4 }).forEach(() => foundationGroup.appendChild(createSlot()));

    const topRow = document.createElement('div');
    topRow.className = 'top-row';
    topRow.append(stock, foundationGroup);

    const tableau = document.createElement('div');
    tableau.className = 'tableau';
    Array.from({ length: 7 }).forEach((_, i) => tableau.appendChild(createSlot(`tableau-${i}`)));

    board.append(header, topRow, tableau);
    root.append(board);

    dealCards();

    document.querySelectorAll('.card-slot, .pile').forEach(slot => {
      slot.addEventListener('dragover', (e) => e.preventDefault());
      slot.addEventListener('drop', handleDrop);
    });

    document.getElementById('restart-button').onclick = restartSolitaire;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
    const card = createCardElement(cardData, true);
    e.currentTarget.appendChild(card);
  };

  const dealCards = () => {
    let cardIndex = 0;
    for (let i = 0; i < 7; i++) {
      const column = document.getElementById(`tableau-${i}`);
      for (let j = 0; j <= i; j++) {
        const faceUp = j === i;
        column.appendChild(createCardElement(deck[cardIndex++], faceUp));
      }
    }
  };

  const drawFromStock = () => {
    if (deck.length === 0) return;
    const cardData = deck.pop();
    const card = createCardElement(cardData, true);
    document.querySelector('.foundation-group').lastElementChild.appendChild(card);
  };

  const restartSolitaire = () => {
    createDeck();
    shuffleDeck();
    renderInitialLayout();
  };

  restartSolitaire();
}
```