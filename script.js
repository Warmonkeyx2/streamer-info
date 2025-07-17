<script>
  // Toggle Info Card visibility
  function toggleCard() {
    const card = document.getElementById("infoCard");
    if (card) {
      card.style.display = card.style.display === "flex" ? "none" : "flex";
    }
  }

  // Show specific content tab
  function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');

    const target = document.getElementById(tabId);
    if (target) {
      target.style.display = 'flex';
    }
  }

  // Toggle color picker display
  function toggleColorPicker() {
    const picker = document.getElementById("colorPicker");
    if (picker) {
      picker.style.display = picker.style.display === "block" ? "none" : "block";
    }
  }

  // Update CSS accent color and apply to UI elements
  function updateThemeColor(hexColor) {
    if (!hexColor) return;

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

  // Save updated streamer name and bio
  function updateStreamerInfo() {
    const name = document.getElementById('streamerNameInput')?.value || '';
    const bio = document.getElementById('streamerBioInput')?.value || '';

    const nameDisplay = document.querySelector('#homeTab h3');
    const bioDisplay = document.querySelector('#homeTab p');

    if (nameDisplay && name.trim()) nameDisplay.textContent = name;
    if (bioDisplay) bioDisplay.innerHTML = bio.replace(/\n/g, '<br>');
  }

  // Live preview for profile image
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

  // Control which social links show and update their URLs
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
    if (!container) return;

    container.innerHTML = ''; // Clear current links

    links.forEach(link => {
      const checkbox = document.getElementById(`${link.id}Check`);
      const urlInput = document.getElementById(`${link.id}URL`);
      const isChecked = checkbox?.checked;
      const url = urlInput?.value || '';

      if (isChecked && url.trim()) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.textContent = link.name;
        container.appendChild(a);
      }
    });
  }

  // Initialize first tab when the page loads
  window.onload = () => {
    showTab('homeTab');
    updateStreamerLinks();
  };
</script>
