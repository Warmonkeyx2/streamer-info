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

    container.innerHTML = '';

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

  // --- CUSTOM SERVER SETTINGS SECTION ---
  let customServerCount = 0;
  const maxCustomServers = 6;

  function toggleServerSettings() {
    const panel = document.getElementById("serverSettingsPanel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  }

  function addServerType() {
    if (customServerCount >= maxCustomServers) return alert("Max 6 custom server types allowed.");

    const container = document.getElementById("customServerTypesContainer");
    const tabId = `customTab${customServerCount}`;
    const name = `Custom ${customServerCount + 1}`;

    // Add button to nav
    const serverBtn = document.createElement("button");
    serverBtn.textContent = name;
    serverBtn.onclick = () => showTab(tabId);
    document.getElementById("serverTypeButtons").appendChild(serverBtn);

    // Add matching tab
    const newTab = document.createElement("div");
    newTab.className = "tab-content";
    newTab.id = tabId;
    newTab.style.display = "none";
    newTab.innerHTML = `
      <h3>${name}</h3>
      <div class="server-entry">
        <img src="assets/placeholder.png" alt="${name} Logo" />
        <a href="#" target="_blank">${name} Link</a>
      </div>
    `;
    document.getElementById("infoCard").appendChild(newTab);

    // Add setting input
    const settingRow = document.createElement("div");
    settingRow.className = "link-setting";
    settingRow.innerHTML = `
      <input type="text" placeholder="Custom Name" value="${name}" onchange="renameServerTab('${tabId}', this.value)" />
      <button onclick="removeServerType('${tabId}', this)">❌</button>
    `;
    container.appendChild(settingRow);

    customServerCount++;
  }

  function removeServerType(tabId, btnElement) {
    const tab = document.getElementById(tabId);
    if (tab) tab.remove();

    const nav = document.getElementById("serverTypeButtons");
    const btns = Array.from(nav.querySelectorAll("button"));
    const match = btns.find(btn => btn.onclick?.toString().includes(tabId));
    if (match) match.remove();

    btnElement.parentElement.remove();
    customServerCount--;
  }

  function renameServerTab(tabId, newName) {
    const nav = document.getElementById("serverTypeButtons");
    const btns = Array.from(nav.querySelectorAll("button"));
    const match = btns.find(btn => btn.onclick?.toString().includes(tabId));
    if (match) match.textContent = newName;

    const tab = document.getElementById(tabId);
    if (tab) {
      const h3 = tab.querySelector("h3");
      if (h3) h3.textContent = newName;
      const a = tab.querySelector("a");
      if (a) a.textContent = `${newName} Link`;
    }
  }

  // INIT
  window.onload = () => {
    showTab('homeTab');
    updateStreamerLinks();
  };
</script>
