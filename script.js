function toggleCard() {
  const card = document.getElementById("infoCard");
  card.style.display = card.style.display === "flex" ? "none" : "flex";
}

function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}
