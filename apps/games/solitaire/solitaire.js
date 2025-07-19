document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.querySelector(".game-area");

  // Generate simple placeholder cards
  for (let i = 1; i <= 8; i++) {
    const card = document.createElement("div");
    card.classList.add("solitaire-card");
    card.innerHTML = `<span>${i}</span>`;
    gameArea.appendChild(card);
  }

  // Apply animation after load
  const cards = document.querySelectorAll(".solitaire-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animated-in");
    }, index * 100);
  });
});
