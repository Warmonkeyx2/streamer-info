function toggleCard() {
  const card = document.getElementById("infoCard");

  if (card.classList.contains("show")) {
    // Close card
    card.classList.remove("show");
    setTimeout(() => {
      card.style.display = "none";
    }, 300);
  } else {
    // Open card
    card.style.display = "flex";
    setTimeout(() => {
      card.classList.add("show");
    }, 10);
  }
}
