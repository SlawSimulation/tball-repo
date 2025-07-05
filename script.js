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

window.onload = () => {
  loadCharacters();
  document.getElementById('search-input').addEventListener('input', renderCharacters);
  document.getElementById('game-filter').addEventListener('change', renderCharacters);
};
