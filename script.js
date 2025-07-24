<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Streamer Info</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    :root {
      --accent-color: #00ffff;
    }

    .link-setting {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 10px;
      color: white;
    }
    .link-setting input[type="url"] {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #444;
      background-color: #1c1c1c;
      color: white;
    }
    #linkSettingsContainer {
      max-height: 200px;
      overflow-y: auto;
      padding-right: 4px;
      margin-top: 10px;
    }
    #toggleLinkSettings {
      margin-top: 12px;
      margin-bottom: 4px;
      cursor: pointer;
      background-color: transparent;
      color: var(--accent-color);
      font-weight: bold;
      border: none;
      text-decoration: underline;
    }

    .admin-panel {
      position: fixed;
      top: 350px;
      right: 450px;
      width: 800px;
      height: 600px;
      background-color: #111;
      border: 2px solid var(--accent-color);
      border-radius: 16px;
      display: none;
      flex-direction: column;
      z-index: 1000;
      box-shadow: 0 0 20px var(--accent-color);
      color: white;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--accent-color);
    }
    .admin-profile {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .admin-profile img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid var(--accent-color);
    }
    .admin-tabs {
      display: flex;
      gap: 10px;
    }
    .admin-tab {
      padding: 6px 12px;
      background-color: #222;
      color: white;
      border: 1px solid var(--accent-color);
      border-radius: 6px;
      cursor: pointer;
    }
    .admin-tab.active {
      background-color: var(--accent-color);
      color: black;
    }
    .admin-content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    .admin-section {
      display: none;
    }
  </style>
      <script defer>
    function toggleCard() {
      const card = document.getElementById("infoCard");
      card.style.display = card.style.display === "flex" ? "none" : "flex";
    }

    function showTab(tabId) {
      const tabs = document.querySelectorAll('.tab-content');
      tabs.forEach(tab => tab.style.display = 'none');
      document.getElementById(tabId).style.display = 'flex';
    }

    function toggleColorPicker() {
      const picker = document.getElementById("colorPicker");
      picker.style.display = picker.style.display === "block" ? "none" : "block";
    }

    function updateThemeColor(hexColor) {
      document.documentElement.style.setProperty('--accent-color', hexColor);
      const buttons = document.querySelectorAll(
        '.streamer-links a, .internal-nav a, .internal-nav button, .server-entry a, .color-button'
      );
      buttons.forEach(btn => {
        btn.style.backgroundImage = `linear-gradient(#121212, #121212), linear-gradient(to right, ${hexColor}, ${hexColor})`;
      });
    }

    function updateStreamerInfo() {
      const name = document.getElementById('streamerNameInput')?.value;
      const bio = document.getElementById('streamerBioInput')?.value;
      if (name) document.querySelector('#homeTab h3').textContent = name;
      if (bio) document.querySelector('#homeTab p').innerHTML = bio.replace(/\n/g, '<br>');
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
      container.innerHTML = '';
      links.forEach(link => {
        const isChecked = document.getElementById(`${link.id}Check`)?.checked;
        const url = document.getElementById(`${link.id}URL`)?.value;
        if (isChecked && url?.trim() !== '') {
          const a = document.createElement('a');
          a.href = url;
          a.target = "_blank";
          a.textContent = link.name;
          container.appendChild(a);
        }
      });
    }

    function toggleLinkSettings() {
      const container = document.getElementById("linkSettingsContainer");
      container.style.display = container.style.display === "none" ? "block" : "none";
    }

    function showAdminSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.style.display = 'none';
  });
  const target = document.getElementById(sectionId);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.admin-tab[onclick*="${sectionId}"]`)?.classList.add('active');

  if (sectionId === 'serverSettingsPanel') {
    updateServerButtons(); // ✅ call here when cards exist
  }
}


    function toggleAdminPanel() {
      const panel = document.querySelector(".admin-panel");
      if (panel) {
        panel.style.display = panel.style.display === "flex" ? "none" : "flex";
      }
    }
    function updateServerButtons() {
  const serverTab = document.getElementById('serversTab');
  const navContainer = serverTab.querySelector('.internal-nav');
  navContainer.innerHTML = ''; // Clear previous buttons

  const typeCards = document.querySelectorAll('.server-type-card');

  typeCards.forEach((card, i) => {
    const labelInput = card.querySelector('.server-type-label');
    const checkbox = card.querySelector('.server-type-visible');
    const label = labelInput.value.trim();

    if (label && checkbox.checked) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.classList.add('color-button'); // Optional for style
      btn.onclick = () => alert(`Open tab for: ${label}`);
      navContainer.appendChild(btn);
    }
    function openSolitaireApp() {
  const popup = document.getElementById('solitaireWindow');
  const container = document.getElementById('solitaireGameContainer');
  
  // Load the HTML of the game
  fetch('apps/games/solitaire/solitaire.html')
    .then(response => response.text())
    .then(html => {
      container.innerHTML = html;
      popup.style.display = 'flex';
      popup.style.top = '300px';
      popup.style.left = '300px';
    })
    .catch(error => {
      container.innerHTML = '<p style="color: red;">Failed to load game.</p>';
      popup.style.display = 'flex';
    });
}

function closeAppWindow() {
  const popup = document.getElementById('solitaireWindow');
  const container = document.getElementById('solitaireGameContainer');
  popup.style.display = 'none';
  container.innerHTML = ''; // Clean up
}


let offsetX = 0, offsetY = 0, isDragging = false;

function startDrag(e) {
  const win = document.getElementById("solitaireWindow");
  isDragging = true;
  offsetX = e.clientX - win.offsetLeft;
  offsetY = e.clientY - win.offsetTop;

  document.onmousemove = function (event) {
    if (!isDragging) return;
    win.style.left = (event.clientX - offsetX) + "px";
    win.style.top = (event.clientY - offsetY) + "px";
  };

  document.onmouseup = function () {
    isDragging = false;
    document.onmousemove = null;
    document.onmouseup = null;
  };
}
// script.js

function launchSolitaireApp() {
  const appWindow = document.getElementById("solitaireWindow");
  const container = document.getElementById("solitaireGameContainer");

  appWindow.style.display = "flex";
  container.innerHTML = `<div id="solitaire-root"></div>`;

  // Load CSS (ensure it's not already loaded)
  if (!document.querySelector('link[href="apps/games/solitaire/solitaire.css"]')) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "apps/games/solitaire/solitaire.css";
    document.head.appendChild(css);
  }

  // Load JS
  fetch("apps/games/solitaire/solitaire.js")
    .then((res) => res.text())
    .then((scriptText) => {
      const script = document.createElement("script");
      script.textContent = scriptText;
      document.body.appendChild(script);
    })
    .catch((err) => {
      container.innerHTML = "<p>Failed to load Solitaire.</p>";
      console.error("Solitaire Load Error:", err);
    });
}

// Typing effect for terminal output
function typeLines(lines, idx = 0, terminalId = "cmdTerminal") {
  if (idx >= lines.length) {
    document.getElementById(terminalId).innerHTML += `<span class="cmd-cursor">_</span>`;
    return;
  }
  const terminal = document.getElementById(terminalId);
  let i = 0;
  function typeChar() {
    if (i < lines[idx].length) {
      terminal.innerHTML += lines[idx][i++];
      setTimeout(typeChar, 30);
    } else {
      terminal.innerHTML += "<br/>";
      setTimeout(() => typeLines(lines, idx + 1, terminalId), 250);
    }
  }
  typeChar();
}

function getStats() {
  const terminal = document.getElementById("cmdTerminal");
  terminal.innerHTML = ""; // clear
  // TODO: Replace with actual API call and dynamic data
  // For now, use mock data:
  const statsLines = [
    "> Checking stats for Warmonkeyx...",
    "> Followed since: 2020-05-06",
    "> Messages sent: 1423",
    "> Channel points: 12,350",
    "> Thanks for watching!",
  ];
  typeLines(statsLines);
}

  window.onload = () => {
  showTab('homeTab');
  updateStreamerLinks();
  updateServerButtons(); 
};

  </script>
</head>
<body>
  <div class="info-bubble">
    <div class="info-button" onclick="toggleCard()">i</div>
    <div class="info-card" id="infoCard">
      <nav class="top-nav internal-nav">
        <button onclick="showTab('homeTab')">HOME</button>
        <button onclick="showTab('serversTab')">SERVERS</button>
        <div class="settings-icon" onclick="toggleAdminPanel()">⚙️</div>
      </nav>

      <div class="tab-content" id="homeTab">
        <img src="assets/profile.png" alt="Profile" />
        <h3>WARMONKEYX</h3>
        <p>
          Witness the madness unfold under the freeway. From explosive dumpster deals and sketchy science experiments to mysterious rituals beneath the full moon — WarmonkeyX delivers raw, unscripted RP that blends chaos with character-driven lore.
          <br><br>
          If you crave unpredictable storylines, gritty humor, and explosive moments, this is your new religion.
        </p>
        <div class="streamer-links">
          <a href="https://twitch.tv/warmonkeyx" target="_blank">Twitch</a>
          <a href="https://youtube.com/@warmonkeyx" target="_blank">YouTube</a>
          <a href="https://kick.com/warmonkeyx" target="_blank">Kick</a>
          <a href="https://discord.gg/ANvfmFFwUS" target="_blank">Discord</a>
          <a href="https://www.tiktok.com/@warmonkeyx" target="_blank">TikTok</a>
          <a href="https://streamelements.com/warmonkeyx/tip" target="_blank">Donate</a>
        </div>
      </div>

      <div class="tab-content" id="serversTab" style="display: none;">
        <h3>Servers</h3>
        <p>Select your server type:</p>
        <div class="internal-nav">
          <button onclick="showTab('gtaTab')">GTA RP</button>
          <button onclick="showTab('redmTab')">RedM RP</button>
        </div>
      </div>

      <div class="tab-content" id="gtaTab" style="display: none;">
        <h3>GTA RP Servers</h3>
        <div class="server-entry">
          <img src="assets/server1-logo.png" alt="PRODIGY RP Logo" />
          <a href="https://prodigyrp.net/" target="_blank">PRODIGY RP</a>
        </div>
        <div class="server-entry">
          <img src="assets/server2-logo.png" alt="FREE2 RP Logo" />
          <a href="https://free2rp.com/" target="_blank">FREE2 RP</a>
        </div>
      </div>

      <div class="tab-content" id="redmTab" style="display: none;">
        <h3>RedM RP Servers</h3>
        <div class="server-entry">
          <img src="assets/rserver1-logo.png" alt="Redemption RP Logo" />
          <a href="https://discord.gg/2BaubsMfX4" target="_blank">Redemption RP</a>
        </div>
      </div>
    </div>
  </div>

  <!-- ✅ Admin Panel FLOATING at bottom of BODY -->
  <div class="admin-panel" style="display: none;">
    <div class="admin-header">
      <div class="admin-profile">
        <img src="assets/profile.png" alt="Profile" />
        <div class="admin-profile-info">
          <h3>WARMONKEYX</h3>
        </div>
      </div>
      <div class="admin-tabs">
        <button class="admin-tab active" onclick="showAdminSection('homeSettings')">HOME</button>
        <button class="admin-tab" onclick="showAdminSection('serverSettingsPanel')">SERVERS</button>
      </div>
    </div>

    <div class="admin-content">
      <div id="homeSettings" class="admin-section" style="display: block;">
  <h4>Streamer Settings</h4>

  <div class="admin-field">
    <label for="streamerNameInput">Streamer Name:</label>
    <input type="text" id="streamerNameInput" placeholder="Enter your streamer name" />
  </div>

  <div class="admin-field">
    <label for="streamerBioInput">Streamer Bio:</label>
    <textarea id="streamerBioInput" placeholder="Enter your bio..." rows="4"></textarea>
  </div>

  <div class="admin-field">
    <button onclick="updateStreamerInfo()">Save Info</button>
  </div>

  <div class="admin-field">
    <label for="profileImageUpload">Upload Profile Image:</label>
    <input type="file" id="profileImageUpload" accept="image/*" onchange="updateProfileImage(event)" />
  </div>

  <div class="admin-field">
    <label for="colorPicker">Theme Color:</label>
    <input type="color" id="colorPicker" onchange="updateThemeColor(this.value)" />
  </div>

  <div class="admin-field">
    <button id="toggleLinkSettings" onclick="toggleLinkSettings()">Toggle Streamer Links</button>
  </div>

  <div id="linkSettingsContainer" style="display: none;">
    <div class="link-setting">
      <label><input type="checkbox" id="twitchCheck" checked /> Twitch:</label>
      <input type="url" id="twitchURL" value="https://twitch.tv/warmonkeyx" />
    </div>
    <div class="link-setting">
      <label><input type="checkbox" id="youtubeCheck" checked /> YouTube:</label>
      <input type="url" id="youtubeURL" value="https://youtube.com/@warmonkeyx" />
    </div>
    <div class="link-setting">
      <label><input type="checkbox" id="kickCheck" checked /> Kick:</label>
      <input type="url" id="kickURL" value="https://kick.com/warmonkeyx" />
    </div>
    <div class="link-setting">
      <label><input type="checkbox" id="discordCheck" checked /> Discord:</label>
      <input type="url" id="discordURL" value="https://discord.gg/ANvfmFFwUS" />
    </div>
    <div class="link-setting">
      <label><input type="checkbox" id="tiktokCheck" checked /> TikTok:</label>
      <input type="url" id="tiktokURL" value="https://www.tiktok.com/@warmonkeyx" />
    </div>
    <div class="link-setting">
      <label><input type="checkbox" id="donateCheck" checked /> Donate:</label>
      <input type="url" id="donateURL" value="https://streamelements.com/warmonkeyx/tip" />
    </div>
    <div class="admin-field">
      <button onclick="updateStreamerLinks()">Save Streamer Links</button>
    </div>
  </div>
</div>

      <div id="serverSettingsPanel" class="admin-section" style="display: none;">
  <h3>Server Settings</h3>
  <p>Edit your server types below. Toggle visibility to show/hide them as buttons.</p>

  <di<div class="server-type-grid">
  <!-- Server Type Slot 1 -->
  <div class="server-type-card collapsible-card">
    <div class="card-header" onclick="toggleCollapse(this)">
      <span class="collapse-icon">+</span> GTA RP
    </div>
    <div class="card-body" style="display: none;">
      <label>Server Type:</label>
      <input type="text" class="server-type-label" placeholder="GTA RP" value="GTA RP" />
      <label><input type="checkbox" class="server-type-visible" checked /> Show</label>
    </div>
  </div>

  <!-- Server Type Slot 2 -->
  <div class="server-type-card collapsible-card">
    <div class="card-header" onclick="toggleCollapse(this)">
      <span class="collapse-icon">+</span> RedM RP
    </div>
    <div class="card-body" style="display: none;">
      <label>Server Type:</label>
      <input type="text" class="server-type-label" placeholder="RedM RP" value="RedM RP" />
      <label><input type="checkbox" class="server-type-visible" checked /> Show</label>
    </div>
  </div>

  <!-- Server Type Slot 3 -->
  <div class="server-type-card collapsible-card">
    <div class="card-header" onclick="toggleCollapse(this)">
      <span class="collapse-icon">+</span> Unused
    </div>
    <div class="card-body" style="display: none;">
      <label>Server Type:</label>
      <input type="text" class="server-type-label" placeholder="Unused" />
      <label><input type="checkbox" class="server-type-visible" /> Show</label>
    </div>
  </div>

  <!-- Server Type Slot 4 -->
  <div class="server-type-card collapsible-card">
    <div class="card-header" onclick="toggleCollapse(this)">
      <span class="collapse-icon">+</span> Unused
    </div>
    <div class="card-body" style="display: none;">
      <label>Server Type:</label>
      <input type="text" class="server-type-label" placeholder="Unused" />
      <label><input type="checkbox" class="server-type-visible" /> Show</label>
    </div>
  </div>

  <!-- Server Type Slot 5 -->
  <div class="server-type-card collapsible-card">
    <div class="card-header" onclick="toggleCollapse(this)">
      <span class="collapse-icon">+</span> Unused
    </div>
    <div class="card-body" style="display: none;">
      <label>Server Type:</label>
      <input type="text" class="server-type-label" placeholder="Unused" />
      <label><input type="checkbox" class="server-type-visible" /> Show</label>
    </div>
  </div>

  <!-- Server Type Slot 6 -->
  <div class="server-type-card collapsible-card">
    <div class="card-header" onclick="toggleCollapse(this)">
      <span class="collapse-icon">+</span> Unused
    </div>
    <div class="card-body" style="display: none;">
      <label>Server Type:</label>
      <input type="text" class="server-type-label" placeholder="Unused" />
      <label><input type="checkbox" class="server-type-visible" /> Show</label>
    </div>
  </div>
</div>

<button class="color-button" onclick="updateServerButtons()">Save Server Buttons</button>
</div>

    </div>
  </div>
</body>
</html>


// Expand/Collapse for Server Type Cards (works across pages)
document.addEventListener("DOMContentLoaded", () => {
  const collapsibleCards = document.querySelectorAll(".collapsible-card");

  collapsibleCards.forEach(card => {
    const header = card.querySelector(".card-header");
    const icon = card.querySelector(".collapse-icon");
    const body = card.querySelector(".card-body");

    header.addEventListener("click", () => {
      const isExpanded = card.classList.toggle("expanded");
      body.style.display = isExpanded ? "flex" : "none";
      icon.textContent = isExpanded ? "–" : "+";
    });

    // Set initial collapsed state
    body.style.display = "none";
    icon.textContent = "+";
  });
});
