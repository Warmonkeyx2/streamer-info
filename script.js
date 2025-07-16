function toggleCard() {
  const card = document.getElementById("infoCard");
  card.style.display = card.style.display === "flex" ? "none" : "flex";
}

function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  const target = document.getElementById(tabId);
  if (target) target.style.display = 'flex'; // use flex to match layout
}

function toggleColorPicker() {
  const picker = document.getElementById("colorPicker");
  picker.style.display = picker.style.display === "block" ? "none" : "block";
}

function updateThemeColor(hexColor) {
  const buttons = document.querySelectorAll(
    '.streamer-links a, .internal-nav a, .internal-nav button, .server-entry a, .color-button'
  );
  
  buttons.forEach(btn => {
    btn.style.backgroundImage = `linear-gradient(#121212, #121212), linear-gradient(to right, ${hexColor}, ${hexColor})`;
  });
}
