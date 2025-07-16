function toggleCard() {
  const card = document.getElementById("infoCard");
  if (card.style.display === "flex") {
    card.style.display = "none";
  } else {
    card.style.display = "flex";
  }
}
