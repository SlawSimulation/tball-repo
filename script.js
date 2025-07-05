let allCharacters = {
  tekken3: [],
  ttt2: [],
  tekken8: []
};

async function loadCharacters() {
  try {
    // Load each JSON separately in parallel
    const [tekken3Res, ttt2Res, tekken8Res] = await Promise.all([
      fetch('data/framedata-tekken3.json'),
      fetch('data/framedata-tekkentag2.json'),
      fetch('data/framedata-tekken8.json')
    ]);

    allCharacters.tekken3 = await tekken3Res.json();
    allCharacters.ttt2 = await ttt2Res.json();
    allCharacters.tekken8 = await tekken8Res.json();

    renderCharacters();
  } catch (error) {
    console.error("Error loading character data:", error);
  }
}

function renderCharacters() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const selectedGame = document.getElementById('game-filter').value;

  ['tekken3', 'ttt2', 'tekken8'].forEach(gameId => {
    const container = document.getElementById(`${gameId}-characters`);
    container.innerHTML = '';

    if (selectedGame !== 'all' && selectedGame !== gameId) return;

    allCharacters[gameId].forEach((char, index) => {
      if (!char.name.toLowerCase().includes(searchTerm)) return;

      const targetId = `char-details-${gameId}-${index}`;

      const card = document.createElement('div');
      card.className = 'character-card';
      card.innerHTML = `
        <img src="${char.artwork}" alt="${char.name}" />
        <h3>${char.name}</h3>
        <button class="toggle-btn" data-target="${targetId}">Show Details</button>
        <div id="${targetId}" class="character-details hidden">
          <p><strong>Style:</strong> ${char.style}</p>
          <p><strong>Main Move:</strong> ${char.main_move}</p>
          <p><strong>Frame:</strong> ${char.frame_data}</p>
        </div>
      `;
      container.appendChild(card);
    });
  });

  // Attach toggle button events
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const targetId = btn.getAttribute('data-target');
      const details = document.getElementById(targetId);
      const isHidden = details.classList.toggle('hidden');
      btn.textContent = isHidden ? 'Show Details' : 'Hide Details';
    };
  });
}

function setupBackgroundControls() {
  const bgSelect = document.getElementById('background-select');
  const colorInput = document.getElementById('background-color');

  bgSelect.addEventListener('change', () => {
    const val = bgSelect.value;

    if (val === 'default') {
      colorInput.style.display = 'none';
      document.body.style.background = '#000000'; // default background color
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundPosition = '';
    } else if (val === 'colorpicker') {
      colorInput.style.display = 'inline-block';
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundPosition = '';
      document.body.style.background = colorInput.value;
    } else if (val.startsWith('art')) {
      colorInput.style.display = 'none';
      let imageUrl = '';
      if (val === 'art1') {
        imageUrl = 'url("backgrounds/bg_brick.jpg")'; // Replace with your image path
      } else if (val === 'art2') {
        imageUrl = 'url("backgrounds/bg_brick.jpg")'; // Replace with your image path
      }
      document.body.style.background = '';
      document.body.style.backgroundImage = imageUrl;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundPosition = 'center center';
    }
  });

  colorInput.addEventListener('input', () => {
    if (bgSelect.value === 'colorpicker') {
      document.body.style.background = colorInput.value;
    }
  });
}

window.onload = () => {
  loadCharacters();
  renderCharacters();

  document.getElementById('search-input').addEventListener('input', renderCharacters);
  document.getElementById('game-filter').addEventListener('change', renderCharacters);

  setupBackgroundControls();
};
