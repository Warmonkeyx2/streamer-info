<script>
  // Toggle Info Card visibility
  function toggleCard() {
    const card = document.getElementById("infoCard");
    card.style.display = card.style.display === "flex" ? "none" : "flex";
  }

  // Show specific tab
  function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.style.display = 'none';
    });
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'flex';
  }

  // Toggle visibility of color picker
  function toggleColorPicker() {
    const picker = document.getElementById("colorPicker");
    picker.style.display = picker.style.display === "block" ? "none" : "block";
  }

  // Update global accent color and button gradients
  function updateThemeColor(hexColor) {
    document.documentElement.style.setProperty('--accent-color', hexColor);

    const buttons = document.querySelectorAll(
      '.streamer-links a, .internal-nav a, .internal-nav button, .server-entry a, .color-button'
    );

    buttons.forEach(btn => {
      btn.style.backgroundImage = `
        linear-gradient(#121212, #121212), 
        linear-gradient(to right, ${hexColor}, ${hexColor})
      `;
    });
  }

  // Update Streamer Name & Bio in HOME tab
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

  // Update Profile Image live
  function updateProfileImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.querySelector('#homeTab img');
      if (img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Update social link buttons based on checkboxes and URLs
  function updateStreamerLinks() {
    const links = [
      { id: 'twitch', name: 'Twitch' },
      { id: 'youtube', name: 'YouTube' },
      { id: 'kick', name: 'Kick' },
      { id: 'discord', name: 'Discord' },
      { id: 'tiktok', name: 'TikTok' },
      { id: 'donate', name: 'Donate' }
    ];

    const container = document.querySelector('.streamer-links');
    container.innerHTML = ''; // Clear existing buttons

    links.forEach(link => {
      const isChecked = document.getElementById(`${link.id}Check`).checked;
      const url = document.getElementById(`${link.id}URL`).value;

      if (isChecked && url.trim() !== '') {
        const a = document.createElement('a');
        a.href = url;
        a.target = "_blank";
        a.textContent = link.name;
        container.appendChild(a);
      }
    });
  }

  // Initialize default tab
  window.onload = () => {
    showTab('homeTab');
  };
</script>
