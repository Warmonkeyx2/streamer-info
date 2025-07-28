```js
document.addEventListener('DOMContentLoaded', () => {
  // Ensure all init functions are called on page load
  const initializeApp = () => {
    restorePanelPositions();
    updateServerButtons();
    updateStreamerLinks();
    updateMainStreamerLinks();
    if (window.mockTwitch) renderStreamInfo();
    loadDockVisibilityPrefs();
  };

  const toggleVisibility = elementId => {
    const element = document.getElementById(elementId);
    if (element) element.style.display = (element.style.display === 'block' ? 'none' : 'block');
  };

  const showTab = tabId => {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId)?.style.display = 'block';
  };

  const showAdminSection = sectionId => {
    document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId)?.style.display = 'block';

    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.admin-tab[data-section="${sectionId}"]`)?.classList.add('active');
  };

  const updateStreamerInfo = () => {
    const name = document.getElementById('streamerNameInput')?.value.trim();
    const bio = document.getElementById('streamerBioInput')?.value.trim();
    if (name) document.querySelector('#homeTab h3').textContent = name;
    if (bio) document.querySelector('#homeTab p').textContent = bio;
  };

  const updateProfileImage = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => document.querySelector('#homeTab img').src = e.target.result;
      reader.readAsDataURL(file);
    }
  };

  const updateThemeColor = hexColor => {
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

  const handleStatsFormSubmit = e => {
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
    const lines = availableStats.filter(stat => prefs[stat.key]).map(stat => stat.line);
    typeLines(lines, 0, 'cmdTerminal');
  };

  const restorePanelPositions = () => {
    document.querySelectorAll('.panel').forEach(panel => {
      const pos = localStorage.getItem(`panel_${panel.id}`);
      if (pos) {
        Object.entries(JSON.parse(pos)).forEach(([prop, value]) => panel.style[prop] = value);
      }
    });
  };

  const loadDockVisibilityPrefs = () => {
    const prefs = JSON.parse(localStorage.getItem("dockVisibilityPrefs") || "{}");
    document.querySelectorAll('.dock-toggle').forEach(toggle => {
      toggle.checked = prefs[toggle.dataset.dock] || false;
    });
  };

  const toggleAppsVisibilityControls = () => toggleVisibility('appsVisibilityControls');

  const setDisplayById = (id, display) => {
    const el = document.getElementById(id);
    if (el) el.style.display = display;
  };

  const addEventListeners = () => {
    document.getElementById('infoCardToggleBtn')?.addEventListener('click', () => toggleVisibility('infoCard'));
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });
    document.getElementById('adminToggle')?.addEventListener('click', () => toggleVisibility('adminPanel'));

    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => showAdminSection(tab.dataset.section));
    });

    document.getElementById('updateStreamerBtn')?.addEventListener('click', updateStreamerInfo);
    document.getElementById('profileImageInput')?.addEventListener('change', updateProfileImage);
    document.getElementById('colorPicker')?.addEventListener('input', e => updateThemeColor(e.target.value));

    ['mainStreamerLinks', 'popoutLinksList'].forEach(id => {
      const container = document.getElementById(id);
      container?.addEventListener('input', updateStreamerLinks);
    });

    document.getElementById('updateServerBtn')?.addEventListener('click', updateServerButtons);
    document.getElementById('dockVisibilityToggle')?.addEventListener('click', toggleAppsVisibilityControls);

    document.getElementById('launchSolitaireBtn')?.addEventListener('click', () => setDisplayById('solitaireWindow', 'flex'));
    document.getElementById('solitaireCloseBtn')?.addEventListener('click', () => toggleVisibility('solitaireWindow'));
    document.getElementById('solitaireMinimizeBtn')?.addEventListener('click', () => toggleVisibility('solitaireWindow'));
    document.getElementById('solitaireRestoreBtn')?.addEventListener('click', () => setDisplayById('solitaireWindow', 'flex'));

    document.getElementById('launchStatsBtn')?.addEventListener('click', () => setDisplayById('statsWindow', 'flex'));
    document.getElementById('closeStatsBtn')?.addEventListener('click', () => setDisplayById('statsWindow', 'none'));
    document.getElementById('minimizeStatsBtn')?.addEventListener('click', () => toggleVisibility('statsWindow'));

    document.getElementById('customStatsOpenBtn')?.addEventListener('click', () => toggleVisibility('customStatsPanel'));
    document.getElementById('customStatsCloseBtn')?.addEventListener('click', () => toggleVisibility('customStatsPanel'));
    document.getElementById('statsPrefsForm')?.addEventListener('submit', handleStatsFormSubmit);
  };

  window.onload = initializeApp;
  addEventListeners();
});
```