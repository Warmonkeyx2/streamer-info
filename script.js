<script>
  function toggleCard() {
    const card = document.getElementById("infoCard");
    card.style.display = card.style.display === "flex" ? "none" : "flex";
  }

  function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'flex';
  }

  function toggleColorPicker() {
    const picker = document.getElementById("colorPicker");
    picker.style.display = picker.style.display === "block" ? "none" : "block";
  }

  function updateThemeColor(hexColor) {
    // Update CSS custom property
    document.documentElement.style.setProperty('--accent-color', hexColor);

    // Update dynamic button backgrounds live
    const buttons = document.querySelectorAll(
      '.streamer-links a, .internal-nav a, .internal-nav button, .server-entry a, .color-button'
    );

    buttons.forEach(btn => {
      btn.style.backgroundImage = `linear-gradient(#121212, #121212), linear-gradient(to right, ${hexColor}, ${hexColor})`;
    });
  }

  function updateStreamerInfo() {
    const name = document.getElementById('streamerNameInput').value;
    const bio = document.getElementById('streamerBioInput').value;

    if (name) {
      document.querySelector('#homeTab h3').textContent = name;
    }

    if (bio) {
      document.querySelector('#homeTab p').innerHTML = bio.replace(/\n/g, '<br>');
    }
  }

  function updateProfileImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.querySelector('#homeTab img');
        if (img) img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Show home tab by default when page loads
  window.onload = () => {
    showTab('homeTab');
  };
</script>
