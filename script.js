function toggleCard() {
  const card = document.getElementById("infoCard");
  card.classList.toggle("show");
  card.style.display = card.classList.contains("show") ? "flex" : "none";
}
