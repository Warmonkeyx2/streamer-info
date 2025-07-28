```js
document.addEventListener('DOMContentLoaded', () => {
  // Initialize page
  window.onload = () => {
    restorePanelPositions();
    updateServerButtons();
    updateStreamerLinks();
    updateMainStreamerLinks();
    window.mockTwitch && renderStreamInfo();
    loadDockVisibilityPrefs();
  };

  const addEventListeners = () => {
    // Info Card Toggle
    document.querySelector('#infoCardToggleBtn')?.addEventListener('click', () => toggleVisibility('infoCard'));

    // Tab Switching
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });

    // Admin Panel Toggle
    document.getElementById('adminToggle')?.addEventListener('click', toggleAdminPanel);

    // Admin Panel Section Switching
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => showAdminSection(tab.dataset.section));
    });

    // Update Streamer Info
    document.getElementById('updateStreamerBtn')?.addEventListener('click', updateStreamerInfo);
    document.getElementById('profileImageInput')?.addEventListener('change', updateProfileImage);

    // Theme Color Picker
    document.getElementById('colorPicker')?.addEventListener('input', e => updateThemeColor(e.target.value));

    // Streamer Links
    ['mainStreamerLinks', 'popoutLinksList'].forEach(id => {
      const container = document.getElementById(id);
      container?.addEventListener('input', updateStreamerLinks);
    });

    // Server Buttons
    document.getElementById('updateServerBtn')?.addEventListener('click', updateServerButtons);

    // Dock Visibility Controls
    document.getElementById('dockVisibilityToggle')?.addEventListener('click', toggleAppsVisibilityControls);
    document.getElementById('saveDockVisibility')?.addEventListener('click', saveDockVisibilityPrefs);

    // Handle inputs for Link Settings
    document.getElementById('linkSettingsToggle')?.addEventListener('click', toggleLinkSettings);

    // Solitaire App Logic
    document.getElementById('launchSolitaireBtn')?.addEventListener('click', launchSolitaireApp);
    document.getElementById('solitaireCloseBtn')?.addEventListener('click', closeAppWindow);
    document.getElementById('solitaireMinimizeBtn')?.addEventListener('click', vanishAppWindow);
    document.getElementById('solitaireRestoreBtn')?.addEventListener('click', restoreSolitaire);

    // Stats App Logic
    document.getElementById('launchStatsBtn')?.addEventListener('click', launchStatsApp);
    document.getElementById('closeStatsBtn')?.addEventListener('click', closeStatsWindow);
    document.getElementById('minimizeStatsBtn')?.addEventListener('click', minimizeStatsWindow);

    // Custom Stats Panel
    document.getElementById('customStatsOpenBtn')?.addEventListener('click', openCustomStats);
    document.getElementById('customStatsCloseBtn')?.addEventListener('click', closeCustomStats);
    document.getElementById('statsPrefsForm')?.addEventListener('submit', handleStatsFormSubmit);
  };

  const toggleVisibility = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = element.style.display === 'block' ? 'none' : 'block';
    }
  };

  const showTab = (tabId) => {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId)?.style.display = 'block';
  };

  const toggleAdminPanel = () => toggleVisibility('adminPanel');

  const showAdminSection = (sectionId) => {
    document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId)?.style.display = 'block';
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.admin-tab[data-section="${sectionId}"]`)?.classList.add('active');
  };

  const updateStreamerInfo = () => {
    const name = document.getElementById('streamerNameInput')?.value.trim();
    const bio = document.getElementById('streamerBioInput')?.value.trim();
    if (name) document.querySelector('#homeTab h3')?.textContent = name;
    if (bio) document.querySelector('#homeTab p')?.textContent = bio;
  };

  const updateProfileImage = (event) => {
    const [file] = event.target.files;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => document.querySelector('#homeTab img').src = e.target.result;
      reader.readAsDataURL(file);
    }
  };

  const updateThemeColor = (hexColor) => {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', hexColor);
    document.querySelectorAll('.streamer-links a, .internal-nav a, .internal-nav button, .server-entry a, .color-button').forEach(btn => {
      btn.style.backgroundImage = `linear-gradient(#121212, #121212), linear-gradient(to right, ${hexColor}, ${hexColor})`;
    });
  };

  const updateServerButtons = () => {
    const navContainer = document.getElementById('serverTypeButtons');
    navContainer.innerHTML = '';
    document.querySelectorAll('.server-type-card').forEach((card, i) => {
      const labelInput = card.querySelector('.server-type-label')?.value.trim();
      const checkbox = card.querySelector('.server-type-visible');

      if (checkbox?.checked && labelInput) {
        const button = document.createElement('button');
        button.textContent = labelInput;
        button.className = 'color-button';
        button.addEventListener('click', () => showServerPanel(i));
        navContainer.appendChild(button);
      }
    });
  };

  const handleStatsFormSubmit = (e) => {
    e.preventDefault();
    saveStatsPreferences();
    closeCustomStats();
    showBasicStats();
  };

  const saveStatsPreferences = () => {
    const prefs = {};
    document.querySelectorAll('#statsPrefsForm input[type="checkbox"]').forEach(checkbox => {
      prefs[checkbox.name] = checkbox.checked;
    });
    localStorage.setItem('statsPrefs', JSON.stringify(prefs));
  };

  const showBasicStats = () => {
    const prefs = JSON.parse(localStorage.getItem('statsPrefs') || '{}');
    const lines = availableStats.filter(stat => prefs[stat.key] ?? true).map(stat => stat.line);
    typeLines(lines, 0, 'cmdTerminal');
  };

  const restorePanelPositions = () => {
    document.querySelectorAll('.panel').forEach(panel => {
      const pos = localStorage.getItem(`panel_${panel.id}`);
      if (pos) {
        Object.entries(JSON.parse(pos)).forEach(([prop, value]) => {
          panel.style[prop] = value;
        });
      }
    });
  };

  const loadDockVisibilityPrefs = () => {
    const prefs = JSON.parse(localStorage.getItem("dockVisibilityPrefs") || "{}");
    document.querySelectorAll('.dock-toggle').forEach(toggle => {
      toggle.checked = prefs[toggle.dataset.dock];
    });

    document.getElementById('saveDockVisibility')?.addEventListener('click', () => {
      const dockPrefs = {};
      document.querySelectorAll('.dock-toggle').forEach(toggle => {
        dockPrefs[toggle.dataset.dock] = toggle.checked;
      });
      localStorage.setItem("dockVisibilityPrefs", JSON.stringify(dockPrefs));
    });
  };

  const toggleLinkSettings = () => toggleVisibility('linkSettingsContainer');

  const launchSolitaireApp = () => {
    setDisplayById('solitaireWindow', 'flex');
    document.getElementById('solitaireGameContainer').innerHTML = `<div id="solitaire-root"></div>`;
  };

  const closeAppWindow = () => toggleVisibility('solitaireWindow');

  const vanishAppWindow = () => {
    toggleVisibility('solitaireWindow');
    toggleVisibility('solitaireRestoreBtn');
  };

  const restoreSolitaire = () => {
    setDisplayById('solitaireWindow', 'flex');
    toggleVisibility('solitaireRestoreBtn');
  };

  const launchStatsApp = () => setDisplayById('statsWindow', 'flex');

  const closeStatsWindow = () => setDisplayById('statsWindow', 'none');

  const minimizeStatsWindow = () => toggleVisibility('statsWindow');

  const openCustomStats = () => toggleVisibility('customStatsPanel');

  const closeCustomStats = () => toggleVisibility('customStatsPanel');

  const toggleAppsVisibilityControls = () => toggleVisibility('appsVisibilityControls');
  
  const setDisplayById = (id, display) => {
    const el = document.getElementById(id);
    if (el) el.style.display = display;
  };

  addEventListeners();
});
```