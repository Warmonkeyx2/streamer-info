function toggleCard() {
  const card = document.getElementById("infoCard");
  card.style.display = card.style.display === "flex" ? "none" : "flex";
}

function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}


let currentColor = '#00f0ff'; // Default color

function toggleColorPicker() {
  const picker = document.getElementById("colorPicker");
  picker.style.display = picker.style.display === "block" ? "none" : "block";
}

function updateThemeColor(hexColor) {
  currentColor = hexColor;

  document.documentElement.style.setProperty('--accent-color', currentColor);
}
